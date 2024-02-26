import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./Database/dbConfig.js";
import userRouter from "./Routers/userRouter.js";
dotenv.config()
const port = process.env.PORT
const app = express()
app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())
app.use('/',userRouter)
app.get('/',()=>{
    res.status(200).json({message:"Welcome"})
})
connectDB()
app.listen(port,()=>{
    console.log("app is started in port",port);
})