
const express=require("express");
const authenticate = require("../middleware/auth.middleware");
const { getSalesData, getAnalyticsData } = require("../controllers/dashbboard.controller");
const router=express.Router();

router.get("/",authenticate,getSalesData);
router.get("/analytics",authenticate,getAnalyticsData);


module.exports=router;