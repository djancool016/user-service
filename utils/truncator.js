const config = require('../config')
const {poolManager, runTruncator} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()

module.exports = runTruncator(pool)