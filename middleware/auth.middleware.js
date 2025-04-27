
const jwt=require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate=async(req,res,next)=>{
    // console.log(req.headers)
    try{
        const token=req.headers["authorization"].split(" ")[1];
        // console.log("token",token);

        if(!token){
            // console.log("token");
            return res.status(401).json({success:false,message:"Authentication not provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) ;
        // console.log("decode",decoded)

        const user = await User.findById(decoded.userId).select("-password");
    
        if (!user) {
            console.log("token",token);
          res.status(401).json({ message: "User not found" });
          return;
        }
    
        req.user = user;
        next(); // ✅ Call next() to pass control to the next middleware

    }catch(error){
        console.log(error.message)
        return res.status(401).json({success:false,message:"Unauthorized"})
    }
}

module.exports=authenticate;