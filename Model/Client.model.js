import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({

    name: String,
    email: String,
    phone: Number,
    location: {
        country: String,
        city: String,
        timezone: String
    },
    loginType: {
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
    }
})

const Client = mongoose.model('client', clientSchema, 'Clients')

export default Client