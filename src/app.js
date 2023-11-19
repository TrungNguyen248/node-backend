require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')

//init middeware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

//init db
require('./dbs/init.mongodb')

// const { countConnect } = require('./helpers/checkConnects')
// countConnect()
// const { checkOverload } = require('./helpers/checkConnects')
// checkOverload()

//init routes
app.use('/', require('./routes'))
//hanlde errors
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
    })
})

module.exports = app
