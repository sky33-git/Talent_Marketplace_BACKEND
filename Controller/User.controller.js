import User from "../Model/User.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})

        if (!users) {
            throw new Error("No user signed in yet!")
        }
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const getUserById = async (req, res) => {

    try {
        const user = await User.findOne({ userId: req.params.id })

        if (!user) {
            throw new Error("User not found!")
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const createUser = async (req, res) => {

    try {
        const userCheck = await User.findOne({ email: req.body.email })

        if (userCheck) {
            throw new Error("User already exists!")
        }

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

export const updateUser = async (req, res) => {

    try {
        const user = await User.findOneAndUpdate(
            { userId: req.params.id }, req.body,
            {   new: true,
                runValidators: true
            })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(user)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete({ userId: req.params.id })
        res.json({ message: "User deleted" });
    }
    catch (err) {
        res.status(500).json({
            error: err.message | "No user found!"
        })
    }
}