function generateInvoiceNumber() {
    const timestamp = Date.now().toString(36); // base36 timestamp
    const random = Math.floor(Math.random() * 1e6).toString(36); // random 6-digit number in base36
    const invoiceNo = (timestamp + random).toUpperCase().slice(0, 12);
    return invoiceNo;
  }
  
  // Example usage
module.exports=generateInvoiceNumber;  