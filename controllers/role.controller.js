const config = require('../config')
const {controller} = require('dwij-simple-orm').init(config)
const RoleModel = require('../models/role.model')


const baseController = (method) => (req, res, next) => {
    return controller[method](req, res, next, model = new RoleModel())
}

module.exports = {
    create: baseController('create'),
    read: baseController('read'),
    update: baseController('update'),
    destroy: baseController('destroy')
}