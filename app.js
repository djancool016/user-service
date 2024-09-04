const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 6100
const setupRoutes = require('./routes')

const config = require('./config')
const {databaseManager} = require('dwij-simple-orm').init(config)

databaseManager.connect().then(async () => {
    if(config.truncating) await require('./utils/truncator')
    if(config.migrating) await require('./migrations')
    if(config.seeding) await require('./seeders')
})

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
setupRoutes(app)
app.listen(PORT, () => console.log(`This server is running on port : http://localhost:${PORT}`))