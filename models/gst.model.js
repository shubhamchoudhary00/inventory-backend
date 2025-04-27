
const mongoose=require("mongoose");

const gstSchema=new mongoose.Schema({
    taxPercentage:{
        type:Number,
        required:true,
    },
    sgst:{
        type:Number,
        default:0
    },
    cgst:{
        type:Number,
        default:0
    },
    igst:{
        type:Number,
        default:0
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


const GST=mongoose.model("gst",gstSchema);

module.exports=GST;