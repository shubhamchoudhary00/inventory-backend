

const express=require("express");
const authenticate = require("../middleware/auth.middleware");
const { addUomController, getUomController } = require("../controllers/uomController");
const router=express.Router();

router.post("/",authenticate,addUomController)

router.get("/",authenticate,getUomController)

module.exports=router;