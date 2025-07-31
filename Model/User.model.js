import mongoose from "mongoose";
import Counter from './Counter.model.js'

const UserSchema = new mongoose.Schema({
    userId: Number,
    name: String,
    email: String,
    phone: Number,
    country: String,
    linkedInURL: String,
    githubURL: String,
    portfolioURL: String,
    authProvider: {
        type: String,
        enum: ["linkedIn", "google", "email"]
    },
    categories: [String],
    skills: [String],
    title: String,
    projects: {
        type: [
            {
                title: String,
                techStack: [String],
                projectLiveURL: String,
                description: String
            }
        ],
        default: [],
    },
    experience: {
        type: [
            {
                title: String,
                companyName: String,
                startDate: Date,
                endDate: Date,
                location: String,
                description: String
            }
        ],
        default: []
    },
    education: {
        type: [
            {
                instituteName: String,
                degree: {
                    type: String,
                    enum: ["SSC", "12th/Intermediate", "Bachelors", "Masters"],
                },
                fieldOfStudy: String,
                startDate: Date,
                endDate: Date,
                description: String
            }
        ],
        default: []
    },
    language: {
        type: [{
            langName: String,
            proficiency: {
                type: String,
                enum: ["Fluent", "Intermediate", "Conversational", "Native"]
            }
        }],
        default: []
    },
    charges: {
        userRate: Number,
        serviceFeePercent: {
            type: Number,
            default: 10
        },
        finalRate: Number,
    },
    userProfileImageURL: String,
    backgroundImageURL: String,

}, { timestamps: true }, { _id: false })

UserSchema.pre('save', async function (next) {

    if (!this.isNew) return next();
    
    const counter = await Counter.findOneAndUpdate(
        { name: 'userId' },
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
    )

    this.userId = counter.seq
    next();
})


const User = mongoose.model('users', UserSchema, 'Users')

export default User;
