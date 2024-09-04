require('dotenv').config()
const { parse } = require('pg-connection-string')
const env = process.env.NODE_ENV || 'development'

if (env === 'development' || 'test') {
    const fs = require('fs')
    const path = require('path')
    const dotenv = require('dotenv')
    // Load .env file for local development
    const envFile = path.resolve(__dirname, `.env.${env}`)
  
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile })
    } else {
      console.error(`Environment file ${envFile} not found`)
      process.exit(1)
    }
} else {
// In production, environment variables should be set in server environtment
console.log('Production environment, using Render-provided environment variables.');
}

let db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.PORT
}
if(process.env.DATABASE_URL) db_config = parse(process.env.DATABASE_URL)

const config = {
    // database configuration
    db_config,
    pool_config: {
        connection_limit: process.env.POOL_CONNECTION_LIMIT,
        queue_limit: process.env.POOL_QUEUE_LIMIT,
    },
    db_system: process.env.DB_SYSTEM,
    truncating: process.env.TRUNCATING === '1',
    migrating: process.env.MIGRATING === '1',
    seeding: process.env.SEEDING === '1'
}

module.exports = config