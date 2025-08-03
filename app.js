
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import AuthRouter from "./Routes/Auth.routes.js";
import imageRouter from './Routes/User.image.routes.js'
import userRoutes from './Routes/User.routes.js'
import clientRoutes from './Routes/Client.routes.js'
// import dataParse from './Controller/parser.js'
import educationRoutes from './Routes/Education.routes.js';
import projectRoutes from './Routes/Projects.routes.js'
import languageRoutes from './Routes/Languages.routes.js'
import experienceRoutes from './Routes/Experence.routes.js'


dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/auth/api', AuthRouter)
app.use('/api/users', imageRouter)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/users', educationRoutes)
app.use('/api/users', experienceRoutes)
app.use('/api/users', languageRoutes)
app.use('/api/users', projectRoutes);
// app.use('api/parser', dataParse)

mongoose.connect(process.env.MONGODB_CONNECTION).then(() => {
    console.log("Database connected succesfully!")

    app.listen(PORT, () => {
        console.log(`Server running succesfully on ${PORT}`)
    })

}).catch((err) => {

    throw new Error("database connection failed", err)
})

// https://github.com/sky33-git/Talent_Marketplace_BACKEND.git