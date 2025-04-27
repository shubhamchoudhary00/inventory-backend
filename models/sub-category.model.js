const mongoose=require("mongoose");

const subCategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
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

const SubCategory=mongoose.model("subCategories",subCategorySchema);

module.exports=SubCategory;