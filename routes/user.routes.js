const router = require('express').Router()
const config = require('../config')
const {controller: {sendResponse}} = require('dwij-simple-orm').init(config)
const {
    findByUsername, authenticateUser, generateToken, authorizeUser
} = require('../controllers/user.controller')

router.post('/login', findByUsername, authenticateUser, generateToken, 
    (req, res, next)=> sendResponse(req, res, next, 'payload')
)
router.post('/auth', authorizeUser,
    (req, res, next)=> sendResponse(req, res, next, 'payload')
)

module.exports = router