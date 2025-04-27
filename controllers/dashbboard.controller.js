const { default: mongoose } = require("mongoose");
const Bill = require("../models/bill.model");
const Product = require("../models/product.model");
const handleError = require("./handleError");

const getSalesData = async (req, res) => {
  try {
    // Calculate the date range for the last 6 months
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    // Fetch bills from the last 6 months, sorted by creation date (descending)
    const bills = await Bill.find({
      "customer.billDate": { $gte: sixMonthsAgo.toISOString() }
    }).sort({ createdAt: -1 });

    // Initialize accumulators
    let todaySales = 0; // Sales without GST for today
    let todaySalesWithTax = 0; // Sales with GST for today
    let currentMonthSales = 0; // Sales without GST for current month
    let currentMonthSalesWithTax = 0; // Sales with GST for current month
    let monthWiseSaleData = {}; // Object to store month-wise sales for last 6 months

    // Get current date components
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-based (0 = January)
    const day = currentDate.getDate();

    // Process each bill
    for (let bill of bills) {
      const { customer, gstStatus, summary } = bill;
      const { billDate } = customer;
      const billedDate = new Date(billDate);
      const billYear = billedDate.getFullYear();
      const billMonth = billedDate.getMonth();
      const billedDay = billedDate.getDate();

      // Today's sales
      if (year === billYear && month === billMonth && day === billedDay) {
        if (gstStatus === "withGst") {
          todaySalesWithTax += summary.total;
        } else {
          todaySales += summary.total;
        }
      }

      // Current month's sales
      if (year === billYear && month === billMonth) {
        if (gstStatus === "withGst") {
          currentMonthSalesWithTax += summary.total;
        } else {
          currentMonthSales += summary.total;
        }
      }

      // Month-wise sales (only for last 6 months, already filtered by query)
      const monthKey = `${billYear}-${String(billMonth + 1).padStart(2, "0")}`;
      if (!monthWiseSaleData[monthKey]) {
        // Initialize the month entry
        monthWiseSaleData[monthKey] = {
          withTax: gstStatus === "withGst" ? summary.total : 0,
          withoutTax: gstStatus === "withGst" ? 0 : summary.total,
        };
      } else {
        // Update the existing month entry
        monthWiseSaleData[monthKey].withTax += gstStatus === "withGst" ? summary.total : 0;
        monthWiseSaleData[monthKey].withoutTax += gstStatus === "withGst" ? 0 : summary.total;
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      data: {
        today: {
          withTax: todaySalesWithTax,
          withoutTax: todaySales,
        },
        currentMonth: {
          withTax: currentMonthSalesWithTax,
          withoutTax: currentMonthSales,
        },
        monthWise: monthWiseSaleData,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getAnalyticsData=async(req,res)=>{
    try{
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        // Fetch bills from the last 6 months, sorted by creation date (descending)
        const bills = await Bill.find({
        "customer.billDate": { $gte: sixMonthsAgo.toISOString() }
        }).sort({ createdAt: -1 });

        // Initialize accumulators
        let categoryWiseData={}
        let gstWiseData={}
        let monthWiseSaleData = {}; // Object to store month-wise sales for last 6 months

        // Get current date components
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-based (0 = January)
        const day = currentDate.getDate();

        // Process each bill
        for (let bill of bills) {
        const { customer, gstStatus, summary,items } = bill;
        const { billDate } = customer;
        const billedDate = new Date(billDate);
        const billYear = billedDate.getFullYear();
        const billMonth = billedDate.getMonth();
        const billedDay = billedDate.getDate();

        // Today's sales
        for(let item of items){
            const {gstRate,price,value}=item.product;
            const {quantity}=item
            if(!gstWiseData[gstRate]){
              gstWiseData[gstRate]=price*quantity;
            }else{
              gstWiseData[gstRate]+=price*quantity;
            }

            const productId=new mongoose.Types.ObjectId(value);
            // console.log(productId)

            const product=await Product.findOne({_id:productId}).populate({model:"categories",path:"category"});
            // console.log(product)

            const {category}=product;
            if(category){
              if(!categoryWiseData[category.name]){
                categoryWiseData[category.name]=price*quantity;
              }else{
                categoryWiseData[category.name]+=price*quantity;
  
              }
            }
         
        }
        

   

        // Month-wise sales (only for last 6 months, already filtered by query)
        const monthKey = `${billYear}-${String(billMonth + 1).padStart(2, "0")}`;
        if (!monthWiseSaleData[monthKey]) {
            // Initialize the month entry
            monthWiseSaleData[monthKey] = {
            withTax: gstStatus === "withGst" ? summary.total : 0,
            withoutTax: gstStatus === "withGst" ? 0 : summary.total,
            };
        } else {
            // Update the existing month entry
            monthWiseSaleData[monthKey].withTax += gstStatus === "withGst" ? summary.total : 0;
            monthWiseSaleData[monthKey].withoutTax += gstStatus === "withGst" ? 0 : summary.total;
        }
        }

        // Send response
        res.status(200).json({
        success: true,
        data: {
          categoryWise:categoryWiseData,
          gstWise:gstWiseData,
            monthWise: monthWiseSaleData,
        },
        });
    }catch (error) {
      console.log(error)
        handleError(error, res);
    }
}

module.exports = {getSalesData,getAnalyticsData};