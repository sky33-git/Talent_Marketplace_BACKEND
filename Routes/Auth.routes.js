import express from "express"
import { linkedinCallback } from "../Controller/Auth.controller.js"
import { googleLogin } from "../Controller/Google.Auth.controller.js"

const AuthRouter = express.Router()

AuthRouter.get('/linkedin-login', linkedinCallback)
AuthRouter.post('/google-login', googleLogin)

export default AuthRouter