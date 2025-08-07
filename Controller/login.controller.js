import User from '../Model/User.model.js'
import Client from '../Model/Client.model.js'
import jwt from 'jsonwebtoken'
import admin from '../Config/firebase.js'
import { getAccessToken_User, getUserInfo } from '../Config/loginAuth.js';

// =================== Google Login ===================
export const googleLogin = async (req, res) => {
  try {
    const { email, firebaseToken } = req.body

    if (!email || !firebaseToken) {
      return res.status(400).json({ success: false, error: 'Email and Firebase token are required' })
    }

    const decoded = await admin.auth().verifyIdToken(firebaseToken)
    const { uid: firebaseUId } = decoded

    let user = await User.findOne({ email })
    if (user) {
      user.lastLogin = new Date()
      await user.save()

      const token = jwt.sign({ id: user.userId, role: 'user' }, process.env.JWT_SECRET)
      res.cookie('access_token', token, {
        httpOnly: true,
      })

      return res.status(200).json({
        success: true,
        role: 'user',
        user
      })
    }

    let client = await Client.findOne({ firebaseUId })
    if (client) {
      client.lastLogin = new Date()
      await client.save()

      const token = jwt.sign({ id: client._id, role: 'client' }, process.env.JWT_SECRET)
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({
        success: true,
        role: 'client',
        user: client
      })
    }

    return res.status(200).json({
      success: false,
      needsSignup: true,
      redirect: '/role-selection'
    })

  } catch (error) {
    console.error("Google login error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}


// =================== LinkedIn Login ===================
export const LinkedinLogin = async (req, res) => {
    try {
        const { code } = req.query
        if (!code) {
            return res.status(400).json({ error: "Missing 'code' query parameter" })
        }

        const accessToken = await getAccessToken_User(code)
        const userInfo = await getUserInfo(accessToken.access_token)

        if (!userInfo) {
            return res.status(500).json({ error: "Failed to fetch user info from LinkedIn" })
        }

        const email = userInfo.email

        let user = await User.findOne({ email })
        if (user) {
            user.lastLogin = new Date()
            await user.save()

            const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET)
            res.cookie('jwt_token', token, { httpOnly: true })

            return res.redirect('http://localhost:5173/developer-portfolio')
        }

        let client = await Client.findOne({ email })
        if (client) {
            client.lastLogin = new Date()
            await client.save()

            const token = jwt.sign({ id: client._id, role: 'client' }, process.env.JWT_SECRET)
            res.cookie('jwt_token', token, { httpOnly: true })

            return res.redirect('http://localhost:5173/company-portfolio')
        }

        return res.redirect('http://localhost:5173/role-selection')

    } catch (err) {
        console.error("LinkedIn callback error:", err)
        if (!res.headersSent) {
            return res.status(500).json({ error: err.message })
        }
    }
}

// =================== Logout ===================
export const logout = (req, res) => {
    res.clearCookie('jwt_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    })
    return res.status(200).json({ success: true, message: 'Logged out' })
}
