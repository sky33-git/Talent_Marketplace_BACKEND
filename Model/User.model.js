import mongoose from "mongoose";
import Counter from './Counter.model.js'

const UserSchema = new mongoose.Schema({

    firebaseUId: String,
    userId: Number,
    name: String,
    email: String,
    phone: Number,
    avatar: {
        type: String,
        default: ""
    },
    userProfileImageURL: String,
    backgroundImageURL: String,
    bio: {
        type: String,
        maxlength: 300,
        default: "Pleases add bio!"
    },
    location: {
        country: String,
        city: String,
        timezone: String
    },
    socials: {
        type: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                socialType: String,
                URL: String,
                enum: ["LINKEDIN, GITHUB, PORTFOLIO, INSTAGRAM, TWITTER"]
            }
        ]
    },
    role: {
        type: String,
        default: 'user',
    },
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
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                title: String,
                companyName: String,
                startDate: Date,
                endDate: Date,
                Remote: Boolean,
                currentlyWoorking: Boolean,
                location: String,
                description: String,
            }
        ],
        default: []
    },
    education: {
        type: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
        type: [String],
        default: ""
    },
    charges: {
        userRate: Number,
        serviceFeePercent: {
            type: Number,
            default: 10
        },
        finalRate: Number,
    },
    training: {
        type: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                title: String,
                provider: String,
                location: String,
                startDate: Date,
                endDate: Date,
                description: String
            }
        ],
        default: []
    },
    accomplishment: {
        type: String,
        default: "Eg. Secured 1st rank among 500 entries in National level hackthon."
    },
extraCurricularActivities: {
        type: String,
        default: "Eg. Lead a team of 8 members while organizing a special event in our office for a special occasion."
    },
    lastLogin: Date

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
