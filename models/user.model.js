const config = require('../config')
const {Model, builder, poolManager} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()

const model = {
    table: 'users',
    includes: [
        'id','roleId','username', 'password','email', 
        'name', 'phone', 'address','nik', 'status'
    ],
    association: [
        {
            table: 'roles',
            references: 'roles.id',
            foreignKey: 'users.roleId',
            includes: ['name'],
            alias: {
                name: 'role'
            }
        }
    ]
}


class UserModel extends Model{
    constructor(){
        super(pool, model, builder)
    }
}
module.exports = UserModel