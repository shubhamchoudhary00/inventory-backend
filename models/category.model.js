const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
      isActive:{
           type:Boolean,
           default:true
       },
       addedBy:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"users"
       }
},{timestamps:true});

const Category=mongoose.model("categories",categorySchema);

module.exports=Category;