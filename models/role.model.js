const config = require('../config')
const {Model, builder, poolManager} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()

const model = {
    table: 'roles',
    includes: [
        'id','name', 'description'
    ],
    association: []
}

class RoleModel extends Model{
    constructor(){
        super(pool, model, builder)
    }
}
module.exports = RoleModel