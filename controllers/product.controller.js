const { default: mongoose } = require("mongoose");
const Product = require("../models/product.model");
const handleError = require("./handleError")

const addProductController=async(req,res)=>{
    // console.log("body",req.body);
    try{
        const userId=req.user?._id
        const {categoryId,subcategoryId,stock,productName,price,unitOfMeasure,hsnSacCode,gstRate}=req.body;
        if( !stock  || !productName || !price || !unitOfMeasure || !hsnSacCode || !gstRate ){
            return res.status(400).json({success:false,message:"Missing required fields"})
        }
        const product=await Product.findOne({productName:productName});
        if(product){
            return res.status(400).json({success:false,message:"Product Already exists"})
        }
        
        const newProduct=new Product({
            productName,
            category:categoryId,
            subCategory:subcategoryId,
            stock,
            gstRate,
            hsnSacCode,
            price,
            unitOfMeasure,
            addedBy:userId

        });
        await newProduct.save();
        return res.status(200).json({success:true,message:"Product addedd successfully0",data:newProduct})
    }catch(error){
        console.log(error)
        handleError(error,res)
    }
}



const getProductController = async (req, res) => {
    try {
      // Fetch active products and populate related fields
      const products = await Product.find({ isActive: true }).sort({createdAt:-1}).populate([
        { path: 'unitOfMeasure', model: 'uom' },
       
      ]);
  
      // Transform products to match frontend expectations
    //   const formattedProducts = products.map(product => ({
    //     value: product._id,
    //     label: product.productName,
    //     price: product.price,
    //     gstRate: product.gstRate,
    //     hsnSacCode: product.hsnSacCode,
    //     unitOfMeasure: product.unitOfMeasure?.uom_short || '' // Fallback if uom_short is missing
    //   }));
  
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
      });
    } catch (error) {
      // Basic error handling if handleError is not defined
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  };


  const deleteProductController = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
      }
  
      // Delete the product
      const product = await Product.findByIdAndDelete(id);
  
      // Check if product exists
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: product, // Optional: include deleted product data
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };



const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    // Validate required fields (adjust based on your schema)
    const requiredFields = ["productName", "price",  "unitOfMeasure", "hsnSacCode", "gstRate", "stock"];
    const missingFields = requiredFields.filter((field) => !updatedData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Update the product
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true, runValidators: true } // `runValidators` ensures schema validations are applied
    );

    // Check if product exists
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};





module.exports={addProductController,getProductController,deleteProductController,updateProductController}