'use strict'

const KeyTokenModel = require('../models/keyToken.model')

class KeyTokenService {
    static createKeyToken = async ({
        userID,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // const publicKeyString = publicKey.toString()
            // const token = await KeyTokenModel.create({
            //     user: userID,
            //     publicKey: publicKeyString,
            // })
            const filter = { user: userID },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokenUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true }

            const tokens = await KeyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService
