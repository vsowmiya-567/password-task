import user from "../Models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mail from "../Services/nodemailer.js";
// import randomstring from "randomstring";
import dotenv from 'dotenv'
dotenv.config()


//user register
export const register_User = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(401).json({ message: 'User already exists!' });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const newUser = new user({
        username,
        email,
        password: hashPassword,
      });
  
      await newUser.save()
      res.status(200).json({status:true,message:`New User ${newUser.username} Registered successfully`,data:newUser})
  
    } catch (error) {
        res.status(500).json({message:"Error in Register"})
    }
}

//login user
export const login_User = async(req,res)=>{
    try {
        const {email,password} = req.body

        const users = await user.findOne({email:email})
        if(!users){
            return res.status(401).json({status:'false',message:"user not exist"})
        }

        const passwordMatch = await bcrypt.compare(password,users.password)
        if(!passwordMatch){
            return res.status(401).json({message:"invalid user password"})
        }

        const token = jwt.sign({_id:users._id},process.env.JWT_SECRETKET)
        // mail(email,link)
        res.status(200).json({status:'true', message:"Login Successfully",token:token})
    } catch (error) {
        res.status(500).json({message:"Error in Login"})

    }
}

//userData
export const userData = async(req,res)=>{
    try {
        const UserId = req.user._id
        const users = await user.findOne({_id:UserId})
        // const randomStr = randomstring.generate()
        if(users){
            return res.status(200).json({message:"user Details",data:users})
        }else{
            return res.status(401).json({message:"user not found"})
        }


    } catch (error) {
        res.status(500).json({message:"Error in get user Data"})
  
    }
}

//forgetPassword
export const forget_Password = async(req,res)=>{
    try {
        const {email} = req.body
        const oldUser = await user.findOne({email})
        console.log(oldUser,email);
        if(!oldUser){
            return res.status(401).json({message:"User Not Exist!!"})
        }
        const token = jwt.sign({email:oldUser.email,id:oldUser._id},
                      process.env.JWT_SECRETKET,{expiresIn:'30m'})

        const link = `http://localhost:3000/confirmpsw/${oldUser._id}/${token}`

        await mail(email,link)

        res.status(200).json({status:'true',message:"reset link",data:token,id:oldUser._id})
        // console.log("link----",link);

    } catch (error) {
        res.status(500).json({message:"Error"}) 
    }
}
// `http://localhost:5000/reset-password/${oldUser._id}/${token}`

// //resetpassword
// export const reset_Password = async(req,res)=>{
//     try {
//         const {newPassword} = req.body
//         const oldUser = await user.findOne({email})
//         if (!oldUser) {
//             return res.status(404).json({ message: 'User not found' });
//           }
//         const token = jwt.sign({email:oldUser.email},process.env.JWT_SECRETKET)
//         const tokenMatch = jwt.verify(token,process.env.JWT_SECRETKET)
//         user.save()
//     } catch (error) {
//         res.status(500).json({message:"Error in reset password"})
//     }
// }


//reset password get
// export const reset_Password = async(req,res)=>{
//     try {
//         console.log("reset password block");
//         const id = req.user.id
        
//         console.log("id",id);
//         const password = req.body.newPassword
//         console.log("password",password);
//         const oldUser = await user.findById(id)
//         if(!oldUser){
//             return res.status(401).json({message:"User Not Exist!!"})
//         }
//         const hashPassword = await bcrypt.hash(password,10)
//         // oldUser.password = hashPassword
//         // oldUser.save()
//         await user.updateOne({_id:id},{$set:{password:hashPassword}})

//         res.status(200).json({status: "true", message:"password updated"})

//     } catch (error) {
//         res.status(500).json({message:"Error in reset password"})
//     }
// }

//reset password post
export const reset_Passwords = async(req,res)=>{
    try {
        const {id,token} = req.params
        // console.log("req",req.params);
        const {newPassword} = req.body
        // console.log(newPassword);
        const oldUser = await user.findOne({_id:id})
        // console.log(oldUser);
        if(!oldUser){
            return res.status(401).json({message:"User Not Exist!!"})
        }
        try {
            
            const decode = jwt.verify(token,process.env.JWT_SECRETKET)
            // console.log("decode",decode);
            if(!decode){
                return res.status(401).json({message:'token is missing'})
            }
            const hashPassword = await bcrypt.hash(newPassword,10)
            // console.log(hashPassword);
    
            await user.findByIdAndUpdate({_id:id},{$set:{password:hashPassword}})
            res.status(200).json({status: "true", message:"password updated"})
        } catch (error) {
            res.status(500).json(error)

        }

    } catch (error) {
        res.status(500).json({message:"Error in update password"})
    }
}