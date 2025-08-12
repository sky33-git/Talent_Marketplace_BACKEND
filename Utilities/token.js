
import jwt from 'jsonwebtoken'

export const generateUserToken = (user) => {
    return jwt.sign(
        { id: user._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}

export const generateClientToken = (client) => {
    return jwt.sign(
        {
            id: client._id, role: 'client'
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}