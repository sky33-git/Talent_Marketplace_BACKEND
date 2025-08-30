import User from '../Model/User.model.js'
import { getAccessToken_User, getUserInfo } from '../Config/auth.js'
import admin from '../Config/firebase.js'
import { generateUserToken } from '../Utilities/token.js'

const BASE_API = process.env.FRONTEND_URL

export const userGoogleSignUp = async (req, res) => {

    const { name, email, phoneNumber, avatar, firebaseToken } = req.body

    let user
    user = await User.findOne({ email })

    if (user) {
        return res.json({
            success: true,
            redirect: (`${BASE_API}/login?userExists=true`),
            userExists: true
        })
    }

    try {
        const authProvider = "google"
        const firebaseUId = uid

        const decoded = await admin.auth().verifyIdToken(firebaseToken)
        const { uid } = decoded;

        const newUser = new User({
            name, email, phoneNumber, avatar, authProvider, firebaseUId
        })
        await newUser.save()
        user = newUser

        user = user.toObject({ getters: true })
        const token = generateUserToken(user)

        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            user,
            token,
            redirect: `${BASE_API}/developer/personal-details/${user.userId}`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}

export const userLinkedinCallback = async (req, res) => {

    try {
        const { code } = req.query;
        console.log(code)

        if (!code) {
            return res.status(400).json({ error: "Missing 'code' query parameter" })
        }
        const accessToken = await getAccessToken_User(code)
        // console.log(accessToken);

        const userInfo = await getUserInfo(accessToken.access_token)

        if (!userInfo) {
            console.error("userInfo failed to generate:", err)
            if (!res.headersSent) {
                return res.status(500).json({ error: err.message })
            }
        }

        let linkedinUser = await User.findOne({ email: userInfo.email })

        if (linkedinUser) {
            return res.redirect(`${BASE_API}/login?userExists=true`)
        }
        else {
            linkedinUser = new User({
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo?.phone,
                country: userInfo?.locale?.country,
                avatar: userInfo.picture,
                authProvider: "linkedIn"
            })
            await linkedinUser.save()
        }

        const token = generateUserToken(linkedinUser)
        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.redirect(`${BASE_API}/developer/personal-details/${linkedinUser.userId}`)
    }
    catch (err) {
        console.error("LinkedIn callback error:", err)

        if (!res.headersSent) {
            return res.status(500).json({ error: err.message })
        }
    }
}