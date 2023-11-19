'use strict'

const { Schema, model } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        permissions: {
            type: [String],
            required: true,
            enum: ['0000', '1111', '2222'],
        },
        createAt: {
            type: Date,
            default: Date.now,
            expires: '30d', //Delete api key after 30 days
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema)
