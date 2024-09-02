const router = require('express').Router()
const config = require('../config')
const {controller: {sendResponse}} = require('dwij-simple-orm').init(config)
const controller = require('../controllers/user.controller')

// Register new user
router.post('/register', controller.register, sendResponse)

// Login using credential username and password
router.post('/login', controller.login, sendResponse)

// Authorize user using token
router.post('/auth', controller.authorizeUser, sendResponse)

// Logout
router.post('/logout', controller.logout, sendResponse)

// Find user by parameter id
router.post('/profile', controller.profile, sendResponse)

// Find user by parameter id
router.get('/:id', controller.read, sendResponse)

// Find user by query or body
router.get('/', controller.read, sendResponse)

// Update user information
router.put('/', controller.update, sendResponse)

// Delete user data
router.delete('/:id', controller.destroy, sendResponse)

module.exports = router