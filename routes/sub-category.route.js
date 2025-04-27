
const express=require("express");
const { addSubCategoryController, getSubCategoryController } = require("../controllers/sub-category.controller");
const authenticate = require("../middleware/auth.middleware");
const router=express.Router();

router.post("/",authenticate,addSubCategoryController)

router.get("/",authenticate,getSubCategoryController)

module.exports=router;