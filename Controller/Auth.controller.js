import User from '../Model/User.model.js'
import jwt from 'jsonwebtoken'

const getAccessToken = async (code) => {

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET_KEY,
        redirect_uri: 'http://localhost:3000/api/linkedin-login',
    })

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    })

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LinkedIn access token fetch failed: ${response.status} ${errorText}`)
    }

    const accessToken = await response.json()
    // console.log(accessToken)
    return accessToken
}

const getUserInfo = async (accessToken) => {

    const response = await fetch(`https://api.linkedin.com/v2/userinfo`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const userInfo = await response.json()
    return userInfo
}

export const linkedinCallback = async (req, res) => {

    try {
        const { code } = req.query;
        console.log(code)

        if (!code) {
            return res.status(400).json({ error: "Missing 'code' query parameter" })
        }
        const accessToken = await getAccessToken(code)
        // console.log(accessToken);

        const userInfo = await getUserInfo(accessToken.access_token)

        if (!userInfo) {
        console.error("userInfo failed to generate:", err)
            if (!res.headersSent) {
                return res.status(500).json({ error: err.message })
            }
        }

        const linkedinUser = new User({
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo?.phone,
            country: userInfo?.locale?.country,
            avatar: userInfo.picture,
            loginType: "linkedIn"
        })
        await linkedinUser.save()

        const token = jwt.sign({
            name: linkedinUser.name,
            email: linkedinUser.email,
            avatar: linkedinUser.picture
        }, process.env.JWT_SECRET)

        res.cookie('jwt_token', token, {
            httpOnly: true
        })

        res.redirect('http://localhost:5173/candidate-fillup')
    }
    catch (err) {
        console.error("LinkedIn callback error:", err)

        if (!res.headersSent) {
            return res.status(500).json({ error: err.message })
        }
    }
}
