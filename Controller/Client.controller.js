import Client from "../Model/Client.model.js";

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const getClientById = async (req, res) => {

    try {
        const clients = await Client.findOne({ clientId: req.params.id })
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const createClient = async (req, res) => {
    try {
        const clients = new Client(req.body)
        await clients.save()

        res.status(201).json({
            message: "Client created successfully",
            clientId: clients.clientId,
            clients
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const updateClient = async (req, res) => {
    try {
        const clients = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

export const deleteClient = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id)
        res.json({ message: "client deleted" });
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}