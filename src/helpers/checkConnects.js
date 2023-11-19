'use strict'

const mongoose = require('mongoose')
const _SECONDS = 5000
const os = require('os')
const process = require('process')

const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`There are ${numConnection} open connections`)
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        const maxConnection = numCores * 5
        console.log(`Numver of actives: ${numConnection} `)
        console.log(`Memory useage: ${memoryUsage / 1024 / 1024} MB`)
        if (numConnection > maxConnection) {
            console.log(`Overload detected `)
        }
    }, _SECONDS)
}

module.exports = { countConnect, checkOverload }
