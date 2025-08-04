import { searchSuggestions, getClientsByQuery, getUsersByQuery, globalAdvancedSearch } from "../Controller/Search.controller.js";
import express from "express"

const router = express.Router()

router.get('/search-clients', getClientsByQuery)
router.get('/search-users', getUsersByQuery)
router.get('/search-suggestions', searchSuggestions)
router.get('/advanced-search', globalAdvancedSearch)

export default router