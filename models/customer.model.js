
const mongoose=require("mongoose");

const customerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    gstNo:{
        type:String
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    pincode:{
        type:String
    },
    country:{
        type:String,
        default:"India"
    },
  
        addedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        }

},{timestamps:true});


const Customer=mongoose.model("customer",customerSchema);
module.exports=Customer;