const { default: mongoose } = require("mongoose");
const generateInvoiceNumber = require("../helpers/invoice-generation");
const {  generatePdfBuffer } = require("../helpers/pdf-generation");
const Bill = require("../models/bill.model");
const handleError = require("./handleError");
const Product = require("../models/product.model");

const addBillController = async (req, res) => {
    console.dir(req.body, { depth: null });
    try {
      const billData = req.body;
  
      // Validate required fields
      if (!billData.customer || !billData.items || !billData.billType || !billData.gstStatus || !billData.summary) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const transformedItems = billData.items.map((item) => {
        if (!item.product || !item.quantity || item.price == null) {
          throw new Error('Invalid item data: product, quantity, and price are required');
        }
        return {
          product: {
            ...item.product,
            price: item.price // Move price into product
          },
          quantity: item.quantity
        };
      });
  
      const invoiceNo = generateInvoiceNumber();
      // Create new bill with transformed items
      const newBill = new Bill({
        ...billData,
        items: transformedItems,
        invoiceNo
      });

      // console.log("new buill",{...billData,invoiceNo:invoiceNo})
      
      // Save bill to database
      const savedBill = await newBill.save();

      for(let item of billData.items){
        const {value}=item.product;
        const {quantity}=item;
        
        // console.log("qty",quantity)

        const productId=new mongoose.Types.ObjectId(value);
        const product=await Product.findOne({_id:productId});
        // console.log(product)
        if(product){
          product.stock=product.stock-quantity;
          await product.save();
        }
      }
      
      // Create PDF in memory
      const pdfBuffer = await generatePdfBuffer(savedBill);
      
      // Return success response with bill data and PDF as Base64
      res.status(201).json({
        message: 'Bill created successfully',
        bill: savedBill,
        pdfData: pdfBuffer.toString('base64'),
        success: true
      });
      
    } catch (error) {
      console.error('Error adding bill:', error);
      res.status(500).json({ error: 'Failed to create bill', details: error.message });
    }
  };
const getBillController=async(req,res)=>{
    // console.log("body",req.body)
    try{
        const bills=await Bill.find({}).sort({createdAt:-1}).lean();
        return res.status(200).json({success:true,message:"Fetched bills",data:bills})
    }catch(error){
        console.log(error)
        handleError(error,res);
    }
}

const generatePdf=async(req,res)=>{
  try{
    const {id}=req.params;
    const bill=await Bill.findOne({_id:id});
    if(!bill){
      return res.status(400).json({success:false,message:"No bill found"})
    };
    const pdfBuffer = await generatePdfBuffer(bill);
      
    // Return success response with bill data and PDF as Base64
    res.status(201).json({
      message: 'Bill created successfully',
      bill: bill,
      pdfData: pdfBuffer.toString('base64'),
      success: true
    });
  }catch(error){
    handleError(error,res)
  }
}


module.exports={addBillController,getBillController,generatePdf}