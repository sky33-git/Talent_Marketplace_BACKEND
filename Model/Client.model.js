import mongoose from "mongoose";
import Counter from "./Counter.model.js"

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AutoIncrementFactory = require('mongoose-sequence');

const AutoIncrement = AutoIncrementFactory(mongoose);

const clientSchema = new mongoose.Schema({

    firebaseUid: String,
    clientId: Number,
    name: String,
    email: String,
    phone: Number,
    location: {
        country: String,
        city: String,
        timezone: String
    },
    role: {
        type: String,
        default: 'client',
    },
    authProvider: {
        type: String,
        enum: ["linkedIn", "google", "email"]
    },
    clientDetails: {
        clientName: String,
        clientSize: {
            type: String,
            enum: ['1-9', '10-25', '26-50', '50+', '100+']
        },
        industry: String,
        clientWebsite: String,
        clientType: {
            type: String,
            enum: ['company', 'agency', 'individual'],
        },
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
});

const Client = mongoose.model('client', clientSchema, 'Clients')

export default Client