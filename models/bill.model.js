const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  hsnSacCode: { type: Number, required: true },
  unitOfMeasure:{type:String,requried:true}
});

const itemSchema = new mongoose.Schema({
  product: { type: productSchema, required: true },
  quantity: { type: Number, required: true, min: 1 },
  // price:{type:Number,default:0,min:0}
});

const summarySchema = new mongoose.Schema({
  subtotal: { type: Number, required: true },
  sgstTotal: { type: Number, required: true },
  cgstTotal: { type: Number, required: true },
  igstTotal: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  total: { type: Number, required: true }
});

const billSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    contact: { type: String },
    paymentMethod: { type: String, enum: ['card', 'cash', 'upi'], required: true },
    billDate: { type: Date, required: true }
  },
  items: [itemSchema],
  billType: { type: String, enum: ['local', 'interstate'], required: true },
  gstStatus: { type: String, enum: ['withGst', 'withoutGst'], required: true },
  summary: summarySchema,
  invoiceNo:{type:String,required:true},
  createdAt: { type: Date, default: Date.now }
});

const Bill= mongoose.model('bills', billSchema);

module.exports=Bill;