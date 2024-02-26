import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoURL = process.env.MONGODBCONNECTIONSTRING
const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(mongoURL)
        console.log("Mongo DB connected");
        return connection;
    } catch (error) {
        console.log(error);
    }
}
export default connectDB