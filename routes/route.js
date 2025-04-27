
const express=require("express");
const router=express.Router();

router.use("/auth",require("./auth.route"));

router.use("/gst",require("./gst.route"));

router.use("/category",require("./category.route"));

router.use("/sub-category",require("./sub-category.route"));

router.use("/uom",require("./uom.route"));

router.use("/products",require("./product.route"));

router.use("/bills",require("./bill.route"));

router.use("/dashboard",require("./dashboard.route"));

module.exports=router;