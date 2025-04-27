const Category = require("../models/category.model");
const handleError = require("./handleError")

const addCategoryController=async(req,res)=>{
    try{
        // console.log(req.body)
        const {name}=req.body;
        const userId=req.user?._id

        if(!name){
            return res.status(400).json({success:false,message:"Missing fields"})
        }
        const categoryName=name.toLowerCase()
        const category=await Category.findOne({name:categoryName});
        if(category){
            return res.status(400).json({sucess:false,message:"Category already exists"})
        }

        const newCategory=new Category({name:categoryName,addedBy:userId});
        await newCategory.save();
        return res.status(200).json({success:true,message:"Category added"})

    }catch(error){
        handleError(error,res)
    }
}


const getCategoryController=async(req,res)=>{
    try{
        const categories=await Category.find({isActive:true}).lean();
        // console.log("category",categories)
        if(!categories || categories.length===0){
            return res.status(400).json({success:false,message:"No Category found"})
        }

        return res.status(200).json({success:true,data:categories,message:"Fetched"})
    }catch(error){
        handleError(error,res);
    }
}

module.exports={addCategoryController,getCategoryController};