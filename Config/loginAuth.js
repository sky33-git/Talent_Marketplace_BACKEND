import { BACKEND_API } from "../Utilities/utility.js";

export const getAccessToken_User = async (code) => {

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET_KEY,
        redirect_uri: `${BACKEND_API}/auth/api/linkedin-login`,
    })

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
    })

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LinkedIn access token fetch failed: ${response.status} ${errorText}`)
    }

    const accessToken = await response.json()
    // console.log(accessToken)
    return accessToken
}

export const getAccessToken = async (code) => {

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET_KEY,
        redirect_uri: `${BACKEND_API}/auth/api/linkedin-login`,
    })

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
    })

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LinkedIn access token fetch failed: ${response.status} ${errorText}`)
    }

    const accessToken = await response.json()
    // console.log(accessToken)
    return accessToken
}

export const getUserInfo = async (accessToken) => {

    const response = await fetch(`https://api.linkedin.com/v2/userinfo`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const clientInfo = await response.json()
    return clientInfo
}