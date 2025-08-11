import User from '../Model/User.model.js'
import jwt from 'jsonwebtoken'
import { getAccessToken_User, getUserInfo } from '../Config/auth.js'
import admin from '../Config/firebase.js'

export const userGoogleSignUp = async (req, res) => {

    const { name, email, phoneNumber, avatar, firebaseToken } = req.body

    let user
    user = await User.findOne({ email })

    if (user) {
        alert("user already exists | Please login!");

        res.status(200).json({
            success: false,
            redirect: (`http://localhost:5173/login`)
        })
    }

    else {
        if (!user) {

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
                const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET)

                res.cookie('access_token', token, {
                    httpOnly: true
                })

                res.status(200).json({
                    success: true,
                    user,
                    token,
                    redirect: (`http://localhost:5173/developer/personal-details/${user.userId}`)
                })

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error
                })
            }
        }
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
            
            return res.status(302).json({
                message: 'User already exists',
                redirect: '/login',
            });
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

        const token = jwt.sign(
            { id: linkedinUser._id, role: 'user' }, process.env.JWT_SECRET)

        res.cookie('jwt_token', token, {
            httpOnly: true
        })

        res.redirect(`http://localhost:5173/developer/preview/${linkedinUser.userId}`)
    }
    catch (err) {
        console.error("LinkedIn callback error:", err)

        if (!res.headersSent) {
            return res.status(500).json({ error: err.message })
        }
    }
}