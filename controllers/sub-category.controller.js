const SubCategory = require("../models/sub-category.model");
const handleError = require("./handleError")

const addSubCategoryController = async (req, res) => {
    try {
      const { parentCategoryId, subcategories } = req.body;
      const userId=req.user?._id
      // Validate input
      if (!parentCategoryId || !subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
        return res.status(400).json({ success: false, message: "Missing or invalid fields: parentCategoryId and subcategories array are required" });
      }
  
      // Validate subcategory objects
      const invalidSubcategories = subcategories.some(subcat => !subcat.name || typeof subcat.name !== 'string');
      if (invalidSubcategories) {
        return res.status(400).json({ success: false, message: "All subcategories must have a valid name" });
      }
  
      // Convert names to lowercase for case-insensitive comparison (already done in frontend, but ensure here for consistency)
      const subcategoryNames = subcategories.map(subcat => subcat.name.toLowerCase());
  
      // Check for existing subcategories
      const existingSubCategories = await SubCategory.find({
        name: { $in: subcategoryNames },
        category: parentCategoryId,
      });
  
      if (existingSubCategories.length > 0) {
        const existingNames = existingSubCategories.map(subcat => subcat.name);
        return res.status(400).json({
          success: false,
          message: `Subcategories already exist: ${existingNames.join(", ")}`,
        });
      }
  
      // Create new subcategories
      const newSubCategories = subcategories.map(subcat => ({
        name: subcat.name.toLowerCase(), // Ensure lowercase in database
        category: parentCategoryId,
        addedBy:userId
      }));
  
      // Save all subcategories
      await SubCategory.insertMany(newSubCategories);
  
      return res.status(200).json({
        success: true,
        message: "Subcategories added successfully",
        data: newSubCategories,
      });
  
    } catch (error) {
      handleError(error, res);
    }
  };


const getSubCategoryController=async(req,res)=>{
    try{
        const categories=await SubCategory.find({isActive:true}).lean();
      

        return res.status(200).json({success:true,data:categories,message:"Fetched"})
    }catch(error){
        handleError(error,res);
    }
}

module.exports={addSubCategoryController,getSubCategoryController};