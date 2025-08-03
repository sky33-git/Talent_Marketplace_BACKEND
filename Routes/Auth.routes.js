import express from "express"
import { userLinkedinCallback, userGoogleSignUp } from "../Controller/authUser.controller.js"
import { clientLinkedinCallback, clientGoogleSignUp } from '../Controller/authClient.controller.js'
import { LinkedinLogin, googleLogin, logout } from "../Controller/login.controller.js"

const AuthRouter = express.Router()

AuthRouter.get('/user-linkedin-signup', userLinkedinCallback)
AuthRouter.post('/user-google-signup', userGoogleSignUp)

AuthRouter.get('/client-linkedin-signup', clientLinkedinCallback)
AuthRouter.post('/client-google-signup', clientGoogleSignUp)

AuthRouter.get('/linkedin-login', LinkedinLogin)
AuthRouter.post('/google-login', googleLogin)

AuthRouter.post('/logout', logout);

export default AuthRouter