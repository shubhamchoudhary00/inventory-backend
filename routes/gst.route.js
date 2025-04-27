
const express=require("express");
const { addGSTController, getGSTController } = require("../controllers/gst.controller");
const authenticate = require("../middleware/auth.middleware");
const router=express.Router();

router.post("/",authenticate,addGSTController)

router.get("/",authenticate,getGSTController)

module.exports=router;