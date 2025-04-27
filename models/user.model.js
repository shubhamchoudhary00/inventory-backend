const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
},{timestamps:true});

const User=mongoose.model("user",userSchema);

module.exports=User;