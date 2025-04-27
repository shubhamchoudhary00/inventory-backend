
const express=require("express");
const { addCategoryController, getCategoryController } = require("../controllers/category.controller");
const authenticate = require("../middleware/auth.middleware");
const router=express.Router();

router.post("/",authenticate,addCategoryController)

router.get("/",authenticate,getCategoryController)

module.exports=router;