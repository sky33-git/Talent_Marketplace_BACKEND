import User from "../Model/User.model.js"
import jwt from 'jsonwebtoken'

export const googleLogin = async (req, res) => {

    try {
        const { name, email, phoneNumber, avatar } = req.body

        let user
        user = await User.findOne({ email })

        const loginType = "google"

        if (!user) {
            const newUser = new User({
                name, email, phoneNumber, avatar, loginType
            })
            await newUser.save()
            user = newUser
        }

        user = user.toObject({ getters: true })

        const token = jwt.sign(user, process.env.JWT_SECRET)
        
        res.cookie('access_token', token, {
            httpOnly: true
        })
        
        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}