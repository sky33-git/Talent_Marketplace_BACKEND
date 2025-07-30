import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    country: String,
    profileURL: String,
    coverImageURL: String,
    loginType: {
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
        default: []
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
                    enum: ["SSC", "12th/Intermediate", "Under-Graduate(UG)", "Post-Graduate(PG)"],
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
                enum: ["Fluent", "Intermediate", "Conversational"]
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

}, { timestamps: true })

const User = mongoose.model('users', UserSchema, 'Users')

export default User;
