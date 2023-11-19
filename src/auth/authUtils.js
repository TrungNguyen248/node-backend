'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
        })
        //refresh token
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30d',
        })

        //JWT verify

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(err)
            } else {
                console.log('DECODE:::', decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (err) {}
}

module.exports = { createTokenPair }
