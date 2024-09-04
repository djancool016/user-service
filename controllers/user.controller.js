const config = require('../config')
const {
    controller, 
    customError: {errorCode, endpointErrorHandler},
    httpLogger: {dataLogger, statusLogger}
} = require('dwij-simple-orm').init(config)

const UserModel = require('../models/user.model')
const TokenManager = require("../utils/tokenManager")
const PasswordManager = require('../utils/passwordManager')

const baseController = (method) => (req, res, next) => {
    return controller[method](req, res, next, model = new UserModel())
}
const tokenSecret = {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET
}

// find user by username then send user data to next middleware
async function findByUsername(req, res, next){
    try {
        // check username and password
        const { username, password } = req.body
        if (!username || !password) throw errorCode.ER_INVALID_CREDENTIALS

        // find user by username
        const model = new UserModel()
        const user = await model.findByKeys({username}, false)
        if (!user.data[0]) throw errorCode.ER_NOT_FOUND

        // send user data to next middleware
        req.user = user.data[0]
        return next()

    } catch (error) {
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

// get hashed password from user data, compare pasword, then send payload to next middleware
async function authenticateUser(req, res, next){
    try {
        // check hashed password
        const {password} = req.body
        const {password: hash, ...data} = req.user
        if(!hash) throw errorCode.ER_EMPTY_HASHED_PASSWORD

        // Verify password
        const isPasswordValid = await PasswordManager.compare({password, hashedPassword: hash})
        if (!isPasswordValid) throw errorCode.ER_INVALID_PASSWORD

        // send payload to next middleware
        req.payload = { id: data.id, roleid: data.roleid, username: data.username }
        return next()
        
    } catch (error) {
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

// check if cookie tokens exists
function isTokenExist(req){
    const refreshToken = req?.cookies?.refreshToken
    const accessToken = req?.cookies?.accessToken

    const isJwtToken = (token) => {
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
        return jwtRegex.test(token)
    }
    if((!refreshToken || !accessToken) && (!isJwtToken(refreshToken) || !isJwtToken(accessToken))){
        throw errorCode.ER_JWT_NOT_FOUND
    }else{
        return {refreshToken, accessToken}
    }
}

async function authorizeUser(req, res, next, retryCount = 1){
    try {
        const {accessToken} = isTokenExist(req)
        req.payload = await TokenManager.verifyToken(accessToken, tokenSecret.accessToken)
        return next()
        
    } catch (error) {
        if(retryCount === 1) return rotateToken(req, res, next)
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

async function rotateToken(req, res, next){
    try {
        const {refreshToken} = isTokenExist(req)
        req.tokens = await TokenManager.tokenRotation(refreshToken)
        await setTokenCookie(req, res, next)
        return await authorizeUser(req, res, next, 0)

    } catch (error) {
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

// genererate token using payload data
async function generateToken(req, res, next){
    try {
        // check if paylad is present
        if(!req.payload.id) throw errorCode.ER_JWT_EMPTY_PAYLOAD

        // generate Access Token and Refresh Token
        const tokens = await TokenManager.generateTokens(req.payload)

        // send tokens to next middleware
        req.tokens = tokens
        await setTokenCookie(req, res, next)
        return next()

    } catch (error) {
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

// add tokens to res object
function setTokenCookie(req, res, next) {
    try {
        if(!req.tokens) throw errorCode.ER_JWT_FAILED_CREATE_TOKEN

        Object.entries(req.tokens).forEach(([tokenName, tokenValue]) => {
            res.cookie(tokenName, tokenValue, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })
        })
        return next()

    } catch (error) {
        req.result = endpointErrorHandler(error)
        return controller.sendResponse(req, res)
    }
}

module.exports = {
    findByUsername, authenticateUser, generateToken, authorizeUser, setTokenCookie, rotateToken
}
