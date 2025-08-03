import jwt from 'jsonwebtoken';
import User from '../Model/User.model.js';
import Client from '../Model/Client.model.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const authenticate = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);

        const { id, role } = decoded;

        if (!id || !role) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        let entity = null;

        if (role === 'user') {
            entity = await User.findById(id);
        }
        else if (role === 'client') {
            entity = await Client.findById(id);
        }
        else {
            return res.status(403).json({ message: 'Invalid role' });
        }

        if (!entity) {
            return res.status(401).json({ message: 'Entity not found' });
        }

        req.auth = {
            id: entity._id,
            role,
            entity
        };

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
}

export const authorize = (...roles) => {

	return async (req, res, next) => {
		try {

			let user = await User.findOne({ firebaseUid: req.user.uid })

			if (!user) {
				user = await Client.findOne({ firebaseUid: req.user.uid })
			}

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			if (!roles.includes(user.role)) {
				return res.status(403).json({
					success: false,
					message: 'Access denied',
				});
			}

			req.userProfile = user;
			next();

		} 
        catch (error) {
			return res.status(500).json({ message: 'Server error' });
		}
	}
}

