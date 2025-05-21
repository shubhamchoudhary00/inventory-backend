
const express=require("express");
const authenticate = require("../middleware/auth.middleware");
const { addProductController, getProductController, updateProductController, deleteProductController } = require("../controllers/product.controller");
const router=express.Router();

router.post("/",authenticate,addProductController)

router.get("/",authenticate,getProductController);

router.delete("/:id",authenticate,deleteProductController);

router.put("/:id",authenticate,updateProductController)

module.exports=router;