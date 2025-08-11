import mongoose from "mongoose";

import { createRequire } from 'node:module';
import { type } from "node:os";

const require = createRequire(import.meta.url);
const AutoIncrementFactory = require('mongoose-sequence');

const AutoIncrement = AutoIncrementFactory(mongoose);

const clientSchema = new mongoose.Schema({

    firebaseUid: String,
    clientId: { 
        type: Number,
        unique: true
    },
    fullName: String,
    email: String,
    designation: String,
    role: {
        type: String,
        default: 'client',
    },
    authProvider: {
        type: String,
        enum: ["linkedIn", "google", "email"]
    },
    clientDetails:
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: false },
        clientName: String,
        clientEmail: String,
        clientPhone: String,
        clientSize: {
            type: String,
            enum: ['1-9', '10-25', '26-50', '50+', '100+']
        },
        industry: String,
        location: {
            type: {
                country: String,
                city: String
            },
            default: false
        },
        establishedYear: String,
        clientWebsite: String,
        clientType: {
            type: String,
            enum: ['company', 'agency', 'individual'],
        },
        clientSocials: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                socialType: {
                    type: String,
                    enum: ["LINKEDIN", "PORTFOLIO", "INSTAGRAM", "TWITTER"]
                },
                url: String,
            }
        ],
        description: String,
        clientProfileImageURL: String,
        clientBackgroundImageURL: String,
        lastLogin: Date
    }
})

clientSchema.plugin(AutoIncrement, {
    inc_field: 'clientId',
    id: 'client_counter',
    start_seq: 1
})

const Client = mongoose.model('client', clientSchema, 'Clients')

export default Client