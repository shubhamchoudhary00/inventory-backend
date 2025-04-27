
const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        requied:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subCategories"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    stock:{
        type:Number,
        default:0,
    },
    gstRate:{
        type:Number,
        
    },
    hsnSacCode:{
        type:String
    },
    price:{
        type:Number,
    },
    unitOfMeasure:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"uom"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }



},{
    timestamps:true
});

const Product=mongoose.model("products",productSchema);
module.exports=Product;