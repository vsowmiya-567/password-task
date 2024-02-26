import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = async(req,res,next)=>{
    // console.log(req.body.headers.Authorization);
    // console.log(req.body.headers);
    // const token = req.headers.Authorization
    // const token= req.body.headers.Authorization
    const token= req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({message:"Token is missing"})
    }
    try {
        console.log(token);
        // console.log(process.env.JWT_SECRETKET);

        const decoded= jwt.verify(token, process.env.JWT_SECRETKET)
        req.user= decoded
        console.log("req.user", req.user.id);
        next()
        
    } catch (error) {
        res.status(401).json({message:"Invalid Token"})
    }
}

export default authMiddleware
     
        
        