const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const router = require('./router')

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

module.exports = app
