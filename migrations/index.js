const config = require('../config')
const {poolManager, runMigrations} = require('dwij-simple-orm').init(config)

const migrationsObject = {
    roles: require('./202404271305-create-roles'),
    users: require('./202404271321-create-users')
}

const migrations = Object.values(migrationsObject)
const pool = poolManager.connect()

module.exports = runMigrations(migrations, pool)