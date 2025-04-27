
const express=require("express");
const { addBillController, getBillController, generatePdf } = require("../controllers/bill.controller");
const authenticate = require("../middleware/auth.middleware");
const router=express.Router();

router.post("/",authenticate,addBillController)

router.get("/",authenticate,getBillController);

router.get("/:id",authenticate,generatePdf);

module.exports=router;