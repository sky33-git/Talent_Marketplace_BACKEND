import Client from '../Model/Client.model.js'
import jwt from 'jsonwebtoken'
import { getAccessToken, getUserInfo } from '../Config/auth.js'

export const clientLinkedinCallback = async (req, res) => {

    try {
        const { code } = req.query;
        console.log(code)

        if (!code) {
            return res.status(400).json({ error: "Missing 'code' query parameter" })
        }

        const accessToken = await getAccessToken(code)
        // console.log(accessToken);
        const clientInfo = await getUserInfo(accessToken.access_token)

        if (!clientInfo) {
            return res.status(500).json({ error: "Failed to retrieve user info from LinkedIn" });
        }

        let linkedinUser = await Client.findOne({ email: clientInfo.email })

        if (!linkedinUser) {
            linkedinUser = new Client({
                name: clientInfo.name,
                email: clientInfo.email,
                phone: clientInfo?.phone,
                country: clientInfo?.locale?.country,
                avatar: clientInfo.picture,
                authProvider: "linkedIn"
            })
            await linkedinUser.save()
        }

        const token = jwt.sign(
            { id: linkedinUser._id, role: 'client' }, 
            process.env.JWT_SECRET, { expiresIn: '30d' })

        res.cookie('jwt_token', token, {
            httpOnly: true
        })

        res.redirect('http://localhost:5173/company/manual-fillup')
    }
    catch (err) {
        console.error("LinkedIn callback error:", err)

        if (!res.headersSent) {
            return res.status(500).json({ error: err.message })
        }
    }
}

export const clientGoogleSignUp = async (req, res) => {

    try {
        const { name, email, phoneNumber, avatar } = req.body

        let client
        client = await Client.findOne({ email })

        const authProvider = "google"

        if (!client) {
            const newclient = new Client({
                name, email, phoneNumber, avatar, authProvider
            })
            await newclient.save()
            client = newclient
        }

        client = client.toObject({ getters: true })

        const token = jwt.sign({ id: client._id, role: 'client' }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        })

        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            client
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}