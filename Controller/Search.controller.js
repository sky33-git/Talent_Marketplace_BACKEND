
import Client from '../Model/Client.model.js'
import User from '../Model/User.model.js'

export const getUsersByQuery = async (req, res) => {

    try {
        const { q, page = 1, limit = 10 } = req.query

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' })
        }

        const searchRegex = new RegExp(q, 'i')
        const userQuery = {
            $or: [
                { name: searchRegex },
                { title: searchRegex },
                { 'location.city': searchRegex }
            ]
        }

        const users = await User.find(userQuery)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })

        const totalUsers = await User.countDocuments(userQuery)

        res.json({
            data: users,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
        })

    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getClientsByQuery = async (req, res) => {

    try {
        const { q, page = 1, limit = 10 } = req.query

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' })
        }

        const searchRegex = new RegExp(q, 'i')
        const clientQuery = {
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { 'location.city': searchRegex }
            ]
        }

        const clients = await Client.find(clientQuery)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })

        const totalClients = await Client.countDocuments(clientQuery)

        res.json({
            data: clients,
            total: totalClients,
            totalPages: Math.ceil(totalClients / limit),
            currentPage: parseInt(page),
        })

    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const searchSuggestions = async (req, res) => {

    try {
        const { query } = req.query

        if (!query || query.length < 2) {
            return res.json({ suggestions: [] })
        }

        const searchRegex = new RegExp(query, 'i')
        const suggestions = []

        //! User suggestions
        const users = await User.find({
            $or: [
                { name: searchRegex },
                { title: searchRegex },
                { 'location.city': searchRegex }
            ]
        })
            .limit(5)
            .select('name title')

        users.forEach(user => {
            suggestions.push({
                text: user.name,
                type: 'user',
                subtitle: user.title
            })
        })

        //! Client suggestions
        const clients = await Client.find({
            $or: [
                { 'clientDetails.clientName': searchRegex },
                { 'clientDetails.industry': searchRegex },
                { 'location.city': searchRegex }
            ]
        })
            .limit(5)
            .select('clientDetails.clientName clientDetails.industry location.city')

        clients.forEach(client => {
            suggestions.push({
                text: client.clientDetails.clientName,
                type: 'client',
                subtitle: client.clientDetails.industry || client.location.city
            })
        })

        res.json({ suggestions: suggestions.slice(0, 10) })
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const globalAdvancedSearch = async (req, res) => {

    try {
        const {
            query,
            country,
            skills,
            clientType,
            industry,
            sortBy = 'recent',
            type = 'all',
            page = 1,
            limit = 10,
        } = req.query

        const searchRegex = query ? new RegExp(query, 'i') : null
        const skip = (page - 1) * limit
        const parsedLimit = parseInt(limit)

        const results = {}

        let sortOptions = {}
        switch (sortBy) {
            case 'name_asc':
                sortOptions = { name: 1 }
                break
            case 'name_desc':
                sortOptions = { name: -1 }
                break
            case 'recent':
            default:
                sortOptions = { createdAt: -1 }
                break
        }

        //! -------------------- USERS --------------------
        if (type === 'all' || type === 'user') {
            const userQuery = {}

            if (searchRegex) {
                userQuery.$or = [
                    { name: searchRegex },
                    { title: searchRegex },
                    { categories: { $in: [searchRegex] } },
                    { skills: { $in: [searchRegex] } },
                ]
            }

            if (country) userQuery.country = country
            if (skills) {
                const skillsArray = Array.isArray(skills) ? skills : skills.split(',')
                userQuery.skills = { $all: skillsArray }
            }

            const users = await User.find(userQuery)
                .sort(sortOptions)
                .limit(parsedLimit)
                .skip(skip)
                .select('name title skills charges country avatar')

            const totalUsers = await User.countDocuments(userQuery)

            results.users = {
                data: users,
                total: totalUsers,
                totalPages: Math.ceil(totalUsers / parsedLimit),
                currentPage: parseInt(page),
            }
        }

        //! -------------------- CLIENTS --------------------
        if (type === 'all' || type === 'client') {
            const clientQuery = {}

            if (searchRegex) {
                clientQuery.$or = [
                    { 'clientDetails.clientName': searchRegex },
                    { 'clientDetails.industry': searchRegex },
                    { 'location.city': searchRegex },
                ]
            }

            if (clientType) clientQuery['clientDetails.clientType'] = clientType
            if (industry) clientQuery['clientDetails.industry'] = industry

            const clients = await Client.find(clientQuery)
                .sort(sortOptions)
                .limit(parsedLimit)
                .skip(skip)
                .select('clientDetails clientId location.email')

            const totalClients = await Client.countDocuments(clientQuery)

            results.clients = {
                data: clients,
                total: totalClients,
                totalPages: Math.ceil(totalClients / parsedLimit),
                currentPage: parseInt(page),
            }
        }

        return res.json(results)
    }
     catch (error) {
        console.error('Global Search Error:', error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}
