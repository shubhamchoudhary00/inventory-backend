const GST = require("../models/gst.model");
const handleError = require("./handleError")


const addGSTController=async(req,res)=>{
    try{
        const {taxPercentage}=req.body;
        
        const userId=req.user?._id;
        if(!taxPercentage){
            return res.status(400).send({success:false,message:"Missing required fields"})
        }

        const tax=parseInt(taxPercentage);
        if(isNaN(tax)){
            return res.status(400).send({success:false,message:"Not a valid input"})
        }

        const gst=await GST.findOne({taxPercentage:tax});
        if(gst){
            return res.status(400).send({success:false,message:"GST already added"})

        }
        const sgst=tax/2;

        const newGst=new GST({
            taxPercentage,
            sgst,
            cgst:sgst,
            igst:tax,
            addedBy:userId
        });
        await newGst.save();

        return res.status(200).json({success:true,message:"Added successfully"})
        

    }catch(error){
        handleError(error,res)
    }
}


const getGSTController=async(req,res)=>{
    try{
        const gsts=await GST.find({}).lean();
        if(!gsts || gsts.length===0){
            return res.status(400).json({success:false,message:"No Gst found"});
        }
        return res.status(200).json({success:true,message:"Fetched successfully",data:gsts})
    }catch(error){
        handleError(error,res)
    }
}

module.exports={addGSTController,getGSTController}