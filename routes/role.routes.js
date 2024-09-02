const router = require('express').Router()
const config = require('../config')
const {controller: {sendResponse}} = require('dwij-simple-orm').init(config)
const controller = require('../controllers/role.controller')

// create new role
router.post('/', controller.create, sendResponse)

// find role by params id
router.get('/:id', controller.read, sendResponse) 

// find roles by request body
router.get('/', controller.read, sendResponse) 

// update role
router.put('/', controller.update, sendResponse) 

// delete role by params id
router.delete('/:id', controller.destroy, sendResponse) 

module.exports = router