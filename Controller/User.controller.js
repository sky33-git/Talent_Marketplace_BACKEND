import User from "../Model/User.model.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user);
    }

    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()

        res.status(201).json(user);
    }

    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.json(user);
    }

    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: "User deleted" });
    }

    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const userRoutes = [deleteUser, getAllUsers, getUserById, updateUser, createUser]

export default userRoutes;