import Client from '../Model/Client.model.js'
import { getAccessToken, getUserInfo } from '../Config/auth.js'
import { generateClientToken } from '../Utilities/token.js';
import { BASE_API } from '../Utilities/utility.js';

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

        if (linkedinUser) {
            return res.redirect(`${BASE_API}/login/?userExists=true`)
        }

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

        const token = generateClientToken(linkedinUser)

        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.redirect(`${BASE_API}/company/preview/${linkedinUser.clientId}`)
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
        const token = generateClientToken(client)

        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            client,
            token,
            redirect: `${BASE_API}/login/?userExists=true`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}