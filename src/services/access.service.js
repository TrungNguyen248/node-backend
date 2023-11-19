'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
} = require('../core/error.response')

//Service
const { findByEmail } = require('../services/shop.service')

const RoleShop = {
    SHOP: '001',
    WRITER: '002',
    EDITOR: '003',
    ADMIN: '004',
}

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const existShop = await findByEmail({ email })
        if (!existShop) throw new BadRequestError('Shop not found')

        const match = bcrypt.compare(password, existShop.password)
        if (!match) throw new AuthFailureError('Authentication failed')

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        })

        const tokens = await createTokenPair(
            { userID: existShop._id, email },
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            userID: existShop._id.toString(),
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: existShop,
            }),
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        //try {
        const shopEx = await shopModel.findOne({ email }).lean()
        if (shopEx) {
            throw new BadRequestError('Error: Shop already exists')
        }

        const hassPassword = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name,
            email,
            password: hassPassword,
            roles: [RoleShop.SHOP],
        })

        if (newShop) {
            const { privateKey, publicKey } = crypto.generateKeyPairSync(
                'rsa',
                {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                }
            )

            const publicKeyString = await KeyTokenService.createKeyToken({
                userID: newShop._id,
                publicKey: publicKey.toString(),
                privateKey: privateKey.toString(),
            })

            if (!publicKeyString) {
                throw new BadRequestError('Error: Public Key Error')
                // return {
                //     code: 'xxx',
                //     message: 'Public Key Error',
                // }
            }

            //const publicKeyObject = crypto.createPublicKey(publicKeyString)

            const tokens = await createTokenPair(
                { userID: newShop._id, email },
                publicKeyString,
                privateKey
            )

            //console.log(tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens,
                },
            }
        }

        return {
            code: 200,
            metadata: null,
        }
        // } catch (error) {
        //     return {
        //         code: 'ERROR',
        //         message: error.message,
        //         status: 'error',
        //     }
        // }
    }
}

module.exports = AccessService
