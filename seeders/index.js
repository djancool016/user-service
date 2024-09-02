const config = require('../config')
const {poolManager, runSeeds} = require('dwij-simple-orm').init(config)

const seedsObject = {
    roles: require('./202404291044-roles-seed'),
    users: require('./202404291121-users-seed')
}

const seeds = Object.values(seedsObject)
const pool = poolManager.connect()

module.exports = runSeeds(seeds, pool)