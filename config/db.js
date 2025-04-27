
const mongoose=require("mongoose");
// const dotenv=require("dotenv");
// dotenv.config()
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected successfully `.bgCyan.green)

    }catch(error){
        console.log(`Mongo Connection error : ${error}`.bgRed.white)
    }
}

module.exports=connectDB;