const UOM = require("../models/uom.model");
const handleError = require("./handleError")


const addUomController=async(req,res)=>{
    try{
        // console.log("user",req.user)
        const {uom,uom_short}=req.body;
        
        const userId=req.user?._id
        const unit=await UOM.findOne({$or:[{uom},{uom_short}]});
        if(unit){
            return res.status(400).json({success:false,message:"Already present"})
        }
        const newUnit=new UOM({
            uom,uom_short,addedBy:userId
        });
        await newUnit.save();
        return res.status(201).json({success:true,message:"Added successfully"})
    }catch(error){
        console.log(error)
        handleError(error,res)
    }
}
const getUomController=async(req,res)=>{
    try{
        const units=await UOM.find({}).lean();
       
        return res.status(200).json({success:true,message:"Added successfully",data:units})
    }catch(error){
        handleError(error,res)
    }
}

module.exports={addUomController,getUomController};