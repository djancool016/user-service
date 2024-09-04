const config = require('../../config')
const {poolManager, UnitTestFramework, httpLogger:{dataLogger}} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()
const controller = require('../../controllers/user.controller')

let tempInput

const testCases = {
    findByUsername: [
        {
            input: {body: {username: 'admin', password: 'root'}},
            output: {user:{id: 1, username: 'admin'}},
            description: 'Test find by username should returning user data'
        }
    ],
    authenticateUser: [
        {
            input: () => tempInput,
            output: {payload:{id: 1, roleid: 1, username: 'admin'}},
            description: 'Test athenticatUser should compare hash password then returning payload then returning payload'
        }
    ],
    generateToken: [
        {
            input: () => tempInput,
            output: {tokens:{refreshToken: 'random string', accessToken: 'random string'}},
            description: 'Test generateToken should retuning tokens object'
        }
    ],
    authorizeUser: [
        {
            input: () => tempInput,
            output: {payload:{id: 1, roleid: 1, username: 'admin', iat: 'random number', exp: 'random number'}},
            description: 'Test authorizeUser should retuning rotated tokens object'
        }
    ],
    rotateToken: [
        {
            input: () => tempInput,
            output: {tokens:{refreshToken: 'random string', accessToken: 'random string'}},
            description: 'Test authorizeUser should retuning rotated tokens object'
        }
    ]
}

const testModule = () => {
    const res = {cookie: () => {}}
    const next = (req) => () => {
        if(req.tokens) req.cookies = req.tokens
        console.log(req.tokens)
        tempInput = req
        return tempInput
    }
    const test = (method, req) => controller[method](req, res, next(req))

    return {
        findByUsername: (req) => test('findByUsername', req), 
        authenticateUser: (req) => test('authenticateUser', req), 
        generateToken: (req) => test('generateToken', req), 
        authorizeUser: (req) => test('authorizeUser', req),
        rotateToken: (req) => test('rotateToken', req)
    }
}

const test = new UnitTestFramework(testCases, testModule())

test.setBeforeAll = async () => {
    await require('../../utils/truncator')
    await require('../../migrations')
    await require('../../seeders')
}

test.setAfterAll = async () => {
    await pool.end()
}
test.runTest()