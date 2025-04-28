const User = require("../models/user.model");
const handleError = require("./handleError")
const jwt=require("jsonwebtoken")
const loginController=async(req,res)=>{
    try{
        const {name,password}=req.body;
        if(!name || !password){
            return res.status(400).send({success:false,message:"Missing fields"})
        }

        const user=await User.findOne({name});
        if(!user){
            return res.status(400).send({success:false,message:"User does not exists"})
        }
        const isMatch=password===user?.password;
        if(!isMatch){
            return res.status(400).send({success:false,message:"Invalid name or password"})
        }
        const token=jwt.sign({userId:user?._id},process.env.JWT_SECRET_KEY);
        return res.status(200).send({success:true,message:"Logged In" , data:{user,token}})

    }catch(error){
        handleError(error,res)
    }
}
const registerController=async(req,res)=>{
    try{
        const {name,password}=req.body;
        if(!name || !password){
            return res.status(400).send({success:false,message:"Missing fields"})
        }

        const user=await User.findOne({name}).lean();
        // console.log("user",user)
        if(user){
            return res.status(400).send({success:false,message:"User already exists"})
        }
        const newUser=new User({
            name,password
        });
        await newUser.save();
        const token=jwt.sign({userId:newUser?._id},process.env.JWT_SECRET_KEY);
        return res.status(201).send({success:true,message:"Logged In" , data:{newUser,token}})

    }catch(error){
        handleError(error,res)
    }
}

module.exports={loginController,registerController}