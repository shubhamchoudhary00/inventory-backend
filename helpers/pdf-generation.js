const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment-timezone');

/**
 * Generate a PDF invoice in memory with enhanced design and pagination
 * @param {Object} billData - The bill data object
 * @returns {Promise<Buffer>} - Promise that resolves with the PDF buffer
 */
function generatePdfBuffer(billData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 20,
        bufferPages: true,
        info: {
          Title: `Invoice-${billData._id}`,
          Author: 'Kuldeep Submersible Boring Works',
        }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      const colors = {
        primary: '#0C3E67',
        secondary: '#1A6AA1',
        accent: '#D4AF37',
        highlight: '#F8F4E6',
        border: '#3D5A80',
        text: '#293241',
        lightGray: '#E0E0E0',
        white: '#FFFFFF'
      };
      
      const pageHeight = doc.page.height;
      const pageWidth = doc.page.width;
      
      let currentPage = 1;
      let currentY = 0;
      
      addBusinessDetails(doc, colors);
      currentY = 170;
      
      addCustomerDetails(doc, billData, colors);
      currentY = 240;
      
      const tableEndY = addInvoiceTable(doc, billData, colors, currentY, pageHeight);
      currentY = tableEndY;
      
      if (currentY > pageHeight - 240) {
        doc.addPage();
        currentPage++;
        currentY = 50;
      }
      
      const summaryEndY = addSummary(doc, billData, currentY, colors);
      currentY = summaryEndY;
      
      const termsHeight = 100;
      if (currentY + termsHeight > pageHeight - 120) {
        doc.addPage();
        currentPage++;
        currentY = 50;
      }
      
      addTermsAndConditions(doc, currentY, colors);
      
      const totalPages = doc._pageBuffer.length;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        addFooter(doc, pageHeight, colors, i + 1, totalPages);
      }
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Add business header and details with enhanced styling
 */
function addBusinessDetails(doc, colors) {
  doc.rect(20, 20, doc.page.width - 40, 80).fillAndStroke(colors.highlight, colors.border);
  doc.rect(20, 20, 10, 80).fill(colors.accent);
  doc.rect(doc.page.width - 30, 20, 10, 80).fill(colors.accent);
  
  doc.fontSize(16).font('Helvetica-Bold').fillColor(colors.primary)
     .text('Kuldeep Submersible Boring Works', 20, 30, {align: 'center', width: doc.page.width - 40});
  
  doc.fontSize(8).font('Helvetica').fillColor(colors.text)
     .text('SPL. IN : DOMESTIC TYPE SUBMERSIBLE PUMP, JET PUMP & HAND PUMP', {align: 'center'})
     .text('DEALS IN : SANITARY GOODS, C.I., S.W., G.I., P.V.C. PIPE & FITTING', {align: 'center'});
  
  doc.moveDown(0.2);
  
  doc.fontSize(7)
     .text('Dehlon Road, SAHNEWAL-141120 (Ludhiana)', {align: 'center'})
     .text('E-mail : kuldeepboring62@gmail.com', {align: 'center'});
    
  doc.rect(20, 110, doc.page.width - 40, 30).fillAndStroke(colors.white, colors.border);
  doc.rect(20, 110, doc.page.width - 40, 3).fill(colors.accent);
  
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary);
  doc.text('GST No.: 03GCYPS4430J1Z0', 30, 120);
  doc.text('PAN No.: GCYPS4430J', 30, 132);
  
  doc.fillColor(colors.secondary).fontSize(12);
  doc.text('TAX INVOICE', doc.page.width / 2, 123, {align: 'center'});
  
  doc.fillColor(colors.primary).fontSize(7);
  doc.text('Mob.: 97813-66696', doc.page.width - 120, 120);
  doc.text('Mob.: 99142-83152', doc.page.width - 120, 132);
  
  doc.moveDown(1);
}

/**
 * Add customer details section with enhanced styling
 */
function addCustomerDetails(doc, billData, colors) {
  const customer = billData.customer;
  const invoiceDate = moment(customer.billDate).tz('Asia/Kolkata').format('DD-MM-YYYY');
  const invoiceNo = billData.invoiceNo;
  
  doc.rect(20, 150, doc.page.width - 40, 50).fillAndStroke(colors.highlight, colors.border);
  doc.rect(20, 150, (doc.page.width - 40) / 2, 50).fillAndStroke(colors.white, colors.border);
  
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary);
  doc.text('To M/s.', 30, 158);
  doc.font('Helvetica').fillColor(colors.text).text(customer.name, 65, 158);
  
  doc.font('Helvetica-Bold').fillColor(colors.primary).text('Contact:', 30, 170);
  doc.font('Helvetica').fillColor(colors.text).text(customer.contact, 65, 170);
  
  doc.font('Helvetica-Bold').fillColor(colors.primary).text('Supply Type:', 30, 182);
  doc.font('Helvetica').fillColor(colors.text).text(
    billData.billType === 'interstate' ? 'Inter-State Supply' : 'Intra-State Supply', 
    65, 182
  );
  
  doc.rect((doc.page.width / 2) + 10, 150, (doc.page.width - 40) / 2, 50).fillAndStroke(colors.white, colors.border);
  doc.rect((doc.page.width / 2) + 10, 150, (doc.page.width - 40) / 2, 15).fill(colors.lightGray);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.primary)
     .text('INVOICE DETAILS', (doc.page.width / 2) + 10, 155, {align: 'center', width: (doc.page.width - 40) / 2});
  
  doc.font('Helvetica-Bold').fillColor(colors.primary).text('Invoice No.:', (doc.page.width / 2) + 25, 170);
  doc.font('Helvetica').fillColor(colors.text).text(invoiceNo, (doc.page.width / 2) + 85, 170);
  
  doc.font('Helvetica-Bold').fillColor(colors.primary).text('Dated:', (doc.page.width / 2) + 25, 182);
  doc.font('Helvetica').fillColor(colors.text).text(invoiceDate, (doc.page.width / 2) + 85, 182);
  
  doc.font('Helvetica-Bold').fillColor(colors.primary).text('Payment:', (doc.page.width / 2) + 220, 170);
  doc.font('Helvetica').fillColor(colors.text).text(customer.paymentMethod, (doc.page.width / 2) + 260, 170);
}

/**
 * Add invoice items table with enhanced styling, additional UOM column and separate CGST/SGST columns
 */
function addInvoiceTable(doc, billData, colors, startY, pageHeight) {
  const tableTop = startY;
  const tableWidth = doc.page.width - 40;
  const rowHeight = 20;
  const headerHeight = 20;
  const contentEndY = pageHeight - 120;
  
  const showTaxColumns = billData.gstStatus === 'withGst';
  const isLocalBill = billData.billType === 'local';
  
  let columnWidths;
  if (showTaxColumns) {
    if (isLocalBill) {
      // Local bill with separate CGST and SGST columns
      columnWidths = {
        desc: tableWidth * 0.20,
        hsn: tableWidth * 0.08,
        uom: tableWidth * 0.07,
        qty: tableWidth * 0.05,
        rate: tableWidth * 0.10,
        taxable: tableWidth * 0.10,
        cgst: tableWidth * 0.10,
        sgst: tableWidth * 0.10,
        amount: tableWidth * 0.20
      };
    } else {
      // Interstate bill with IGST column
      columnWidths = {
        desc: tableWidth * 0.22,
        hsn: tableWidth * 0.10,
        uom: tableWidth * 0.08,
        qty: tableWidth * 0.06,
        rate: tableWidth * 0.10,
        taxable: tableWidth * 0.12,
        igst: tableWidth * 0.12,
        amount: tableWidth * 0.20
      };
    }
  } else {
    // Without GST columns
    columnWidths = {
      desc: tableWidth * 0.32,
      hsn: tableWidth * 0.12,
      uom: tableWidth * 0.10,
      qty: tableWidth * 0.08,
      rate: tableWidth * 0.15,
      amount: tableWidth * 0.23
    };
  }
  
  const startX = 20;
  let currentX = startX;
  const columnPositions = { desc: currentX };
  currentX += columnWidths.desc;
  columnPositions.hsn = currentX;
  currentX += columnWidths.hsn;
  columnPositions.uom = currentX;
  currentX += columnWidths.uom;
  columnPositions.qty = currentX;
  currentX += columnWidths.qty;
  columnPositions.rate = currentX;
  currentX += columnWidths.rate;
  
  if (showTaxColumns) {
    columnPositions.taxable = currentX;
    currentX += columnWidths.taxable;
    
    if (isLocalBill) {
      columnPositions.cgst = currentX;
      currentX += columnWidths.cgst;
      columnPositions.sgst = currentX;
      currentX += columnWidths.sgst;
    } else {
      columnPositions.igst = currentX;
      currentX += columnWidths.igst;
    }
  }
  
  columnPositions.amount = currentX;
  
  let y = tableTop;
  
  doc.rect(startX, y, tableWidth, headerHeight).fillAndStroke(colors.primary, colors.border);
  doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(7);
  doc.text('Description of Goods', columnPositions.desc + 2, y + 7, {width: columnWidths.desc - 4});
  doc.text('HSN/SAC', columnPositions.hsn + 2, y + 7, {width: columnWidths.hsn - 4, align: 'center'});
  doc.text('UOM', columnPositions.uom + 2, y + 7, {width: columnWidths.uom - 4, align: 'center'});
  doc.text('QTY.', columnPositions.qty + 2, y + 7, {width: columnWidths.qty - 4, align: 'center'});
  doc.text('Rate', columnPositions.rate + 2, y + 7, {width: columnWidths.rate - 4, align: 'right'});
  
  if (showTaxColumns) {
    doc.text('Taxable Value', columnPositions.taxable + 2, y + 7, {width: columnWidths.taxable - 4, align: 'right'});
    
    if (isLocalBill) {
      doc.text('CGST', columnPositions.cgst + 2, y + 7, {width: columnWidths.cgst - 4, align: 'center'});
      doc.text('SGST', columnPositions.sgst + 2, y + 7, {width: columnWidths.sgst - 4, align: 'center'});
    } else {
      doc.text('IGST', columnPositions.igst + 2, y + 7, {width: columnWidths.igst - 4, align: 'center'});
    }
  }
  
  doc.text('Amount', columnPositions.amount + 2, y + 7, {width: columnWidths.amount - 4, align: 'right'});
  
  y += headerHeight;
  
  Object.values(columnPositions).forEach(position => {
    if (position > startX) {
      doc.moveTo(position, tableTop).lineTo(position, y).stroke(colors.border);
    }
  });
  
  doc.font('Helvetica').fontSize(7).fillColor(colors.text);
  let isAlternate = false;
  
  for (let i = 0; i < billData.items.length; i++) {
    const item = billData.items[i];
    
    if (y + rowHeight > contentEndY) {
      doc.rect(startX, tableTop, tableWidth, y - tableTop).stroke(colors.border);
      doc.addPage();
      y = 50;
      
      doc.rect(startX, y, tableWidth, headerHeight).fillAndStroke(colors.primary, colors.border);
      doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(7);
      doc.text('Description of Goods', columnPositions.desc + 2, y + 7, {width: columnWidths.desc - 4});
      doc.text('HSN/SAC', columnPositions.hsn + 2, y + 7, {width: columnWidths.hsn - 4, align: 'center'});
      doc.text('UOM', columnPositions.uom + 2, y + 7, {width: columnWidths.uom - 4, align: 'center'});
      doc.text('QTY.', columnPositions.qty + 2, y + 7, {width: columnWidths.qty - 4, align: 'center'});
      doc.text('Rate', columnPositions.rate + 2, y + 7, {width: columnWidths.rate - 4, align: 'right'});
      
      if (showTaxColumns) {
        doc.text('Taxable Value', columnPositions.taxable + 2, y + 7, {width: columnWidths.taxable - 4, align: 'right'});
        
        if (isLocalBill) {
          doc.text('CGST', columnPositions.cgst + 2, y + 7, {width: columnWidths.cgst - 4, align: 'center'});
          doc.text('SGST', columnPositions.sgst + 2, y + 7, {width: columnWidths.sgst - 4, align: 'center'});
        } else {
          doc.text('IGST', columnPositions.igst + 2, y + 7, {width: columnWidths.igst - 4, align: 'center'});
        }
      }
      
      doc.text('Amount', columnPositions.amount + 2, y + 7, {width: columnWidths.amount - 4, align: 'right'});
      
      y += headerHeight;
      
      Object.values(columnPositions).forEach(position => {
        if (position > startX) {
          doc.moveTo(position, y - headerHeight).lineTo(position, y).stroke(colors.border);
        }
      });
      
      doc.font('Helvetica').fontSize(7).fillColor(colors.text);
    }
    
    if (isAlternate) {
      doc.rect(startX, y, tableWidth, rowHeight).fill(colors.highlight);
    }
    isAlternate = !isAlternate;
    
    const baseAmount = item.quantity * item.product.price;
    let taxRate = 0;
    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let totalAmount = baseAmount;
    
    if (billData.gstStatus === 'withGst') {
      taxRate = item.product.gstRate || 0;
      
      if (isLocalBill) {
        cgstRate = taxRate / 2;
        sgstRate = taxRate / 2;
        cgstAmount = (baseAmount * cgstRate) / 100;
        sgstAmount = (baseAmount * sgstRate) / 100;
        totalAmount = baseAmount + cgstAmount + sgstAmount;
      } else {
        igstRate = taxRate;
        igstAmount = (baseAmount * igstRate) / 100;
        totalAmount = baseAmount + igstAmount;
      }
    }
    
    doc.fillColor(colors.text);
    doc.text(item.product.label, columnPositions.desc + 2, y + 6, {width: columnWidths.desc - 4});
    doc.text(item.product.hsnSacCode || '-', columnPositions.hsn + 2, y + 6, {width: columnWidths.hsn - 4, align: 'center'});
    doc.text(item.product.unitOfMeasure || '-', columnPositions.uom + 2, y + 6, {width: columnWidths.uom - 4, align: 'center'});
    doc.text(item.quantity.toString(), columnPositions.qty + 2, y + 6, {width: columnWidths.qty - 4, align: 'center'});
    doc.text(item.product.price.toFixed(2), columnPositions.rate + 2, y + 6, {width: columnWidths.rate - 4, align: 'right'});
    
    if (showTaxColumns) {
      doc.text(baseAmount.toFixed(2), columnPositions.taxable + 2, y + 6, {width: columnWidths.taxable - 4, align: 'right'});
      
      if (isLocalBill) {
        doc.text(`${cgstRate}%\n${cgstAmount.toFixed(2)}`, columnPositions.cgst + 2, y + 2, {width: columnWidths.cgst - 4, align: 'center'});
        doc.text(`${sgstRate}%\n${sgstAmount.toFixed(2)}`, columnPositions.sgst + 2, y + 2, {width: columnWidths.sgst - 4, align: 'center'});
      } else {
        doc.text(`${igstRate}%\n${igstAmount.toFixed(2)}`, columnPositions.igst + 2, y + 2, {width: columnWidths.igst - 4, align: 'center'});
      }
    }
    
    doc.text(totalAmount.toFixed(2), columnPositions.amount + 2, y + 6, {width: columnWidths.amount - 4, align: 'right'});
    
    y += rowHeight;
    
    Object.values(columnPositions).forEach(position => {
      if (position > startX) {
        doc.moveTo(position, y - rowHeight).lineTo(position, y).stroke(colors.border);
      }
    });
  }
  
  doc.rect(startX, tableTop, tableWidth, y - tableTop).stroke(colors.border);
  return y + 10;
}

/**
 * Add summary and totals with enhanced styling
 */
function addSummary(doc, billData, startY, colors) {
  const summary = billData.summary;
  const summaryWidth = (doc.page.width - 40) * 0.35;
  const startX = doc.page.width - summaryWidth - 20;
  const showTaxes = billData.gstStatus === 'withGst';
  const isLocalBill = billData.billType === 'local';
  
  const summaryHeight = showTaxes ? (isLocalBill ? 100 : 84) : 60;
  
  doc.rect(startX, startY, summaryWidth, summaryHeight).stroke(colors.border);
  doc.rect(startX, startY, summaryWidth, 18).fill(colors.secondary);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.white);
  doc.text('INVOICE SUMMARY', startX, startY + 6, {align: 'center', width: summaryWidth});
  
  let y = startY + 18;
  
  doc.rect(startX, y, summaryWidth, 16).fillAndStroke(colors.highlight, colors.border);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary);
  doc.text('Subtotal:', startX + 5, y + 5);
  doc.font('Helvetica').fillColor(colors.text);
  doc.text(summary.subtotal.toFixed(2), startX + summaryWidth - 45, y + 5, {align: 'right', width: 40});
  
  y += 16;
  
  if (showTaxes) {
    if (isLocalBill) {
      doc.rect(startX, y, summaryWidth, 16).fillAndStroke(colors.white, colors.border);
      doc.font('Helvetica-Bold').fillColor(colors.primary).text('CGST:', startX + 5, y + 5);
      doc.font('Helvetica').fillColor(colors.text).text(summary.cgstTotal.toFixed(2), startX + summaryWidth - 45, y + 5, {align: 'right', width: 40});
      y += 16;
      
      doc.rect(startX, y, summaryWidth, 16).fillAndStroke(colors.highlight, colors.border);
      doc.font('Helvetica-Bold').fillColor(colors.primary).text('SGST:', startX + 5, y + 5);
      doc.font('Helvetica').fillColor(colors.text).text(summary.sgstTotal.toFixed(2), startX + summaryWidth - 45, y + 5, {align: 'right', width: 40});
      y += 16;
    } else {
      doc.rect(startX, y, summaryWidth, 16).fillAndStroke(colors.white, colors.border);
      doc.font('Helvetica-Bold').fillColor(colors.primary).text('IGST:', startX + 5, y + 5);
      doc.font('Helvetica').fillColor(colors.text).text(summary.igstTotal.toFixed(2), startX + summaryWidth - 45, y + 5, {align: 'right', width: 40});
      y += 16;
    }
  }
  
  doc.rect(startX, y, summaryWidth, 20).fillAndStroke(colors.primary, colors.border);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.white);
  doc.text('Grand Total:', startX + 5, y + 7);
  doc.text(summary.total.toFixed(2), startX + summaryWidth - 45, y + 7, {align: 'right', width: 40});
  
  y = startY + summaryHeight + 5;
  doc.rect(20, y, doc.page.width - 40, 22).stroke(colors.border);
  doc.rect(20, y, 100, 22).fill(colors.accent);
  
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.white);
  doc.text('Amount in words:', 25, y + 7);
  doc.font('Helvetica').fontSize(7).fillColor(colors.text);
  doc.text(numberToWords(summary.total), 125, y + 7);
  
  return y + 30;
}

/**
 * Add terms and conditions section
 */
function addTermsAndConditions(doc, startY, colors) {
  const width = doc.page.width - 40;
  
  doc.rect(20, startY, width, 16).fillAndStroke(colors.secondary, colors.border);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.white);
  doc.text('TERMS & CONDITIONS', 20, startY + 5, {align: 'center', width: width});
  
  doc.rect(20, startY + 16, width, 50).stroke(colors.border);
  doc.font('Helvetica').fontSize(7).fillColor(colors.text);
  
  const terms = [
    "1. Payment should be made within 15 days of invoice date.",
    "2. Goods once sold will not be taken back or exchanged.",
    "3. Interest @18% p.a. will be charged on delayed payments.",
    "4. All disputes subject to Ludhiana jurisdiction only.",
    "5. This is a computer-generated invoice and does not require a signature."
  ];
  
  let y = startY + 20;
  terms.forEach(term => {
    doc.text(term, 25, y);
    y += 8;
  });
}

/**
 * Add bank details and footer at bottom of page
 */
function addFooter(doc, pageHeight, colors, pageNumber, totalPages) {
  const footerTop = pageHeight - 90;
  
  doc.rect(20, footerTop, doc.page.width - 40, 70).stroke(colors.border);
  doc.rect(20, footerTop, doc.page.width - 40, 16).fill(colors.secondary);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.white);
  doc.text('BANK DETAILS', doc.page.width / 2, footerTop + 5, {align: 'center'});
  
  const bankSectionWidth = (doc.page.width - 40) / 3;
  
  doc.rect(20, footerTop + 16, bankSectionWidth, 54).fill(colors.white);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary).text('HDFC Bank, Sahnewal', 25, footerTop + 22);
  doc.font('Helvetica').fontSize(6).fillColor(colors.text)
     .text('Account No. 50200054545878', 25, footerTop + 32)
     .text('IFSC Code: HDFC0001340', 25, footerTop + 42);
  
  doc.rect(20 + bankSectionWidth, footerTop + 16, bankSectionWidth, 54).fill(colors.highlight);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary).text('SBI Bank, Sahnewal', 25 + bankSectionWidth, footerTop + 22);
  doc.font('Helvetica').fontSize(6).fillColor(colors.text)
     .text('Account No. 61276277532', 25 + bankSectionWidth, footerTop + 32)
     .text('IFSC Code: SBIN0032243', 25 + bankSectionWidth, footerTop + 42);
  
  doc.rect(20 + (bankSectionWidth * 2), footerTop + 16, bankSectionWidth, 54).fill(colors.white);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.primary)
     .text('For Kuldeep Submersible Boring Works', 20 + (bankSectionWidth * 2), footerTop + 22, {align: 'center', width: bankSectionWidth});
  
  doc.moveTo(20 + (bankSectionWidth * 2) + 15, footerTop + 50)
     .lineTo(20 + (bankSectionWidth * 3) - 15, footerTop + 50)
     .stroke(colors.primary);
  
  doc.font('Helvetica').fontSize(7).fillColor(colors.text)
     .text('Authorized Signatory', 20 + (bankSectionWidth * 2), footerTop + 55, {align: 'center', width: bankSectionWidth});
     
  // doc.fontSize(6).fillColor(colors.secondary)
  //    .text(`Page ${pageNumber} of ${totalPages}`, 20, pageHeight - 20, {align: 'right', width: doc.page.width - 40});
}

/**
 * Convert number to words for amount display
 */
function numberToWords(num) {
  const rs = num.toFixed(2);
  const [whole, decimal] = rs.split('.');
  const wholeNumber = parseInt(whole);
  const decimalNumber = parseInt(decimal);
  
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanOneThousand(num) {
    if (num === 0) return '';
    if (num < 20) return units[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertLessThanOneThousand(num % 100) : '');
  }
  
  function convert(num) {
    if (num === 0) return 'Zero';
    
    let result = '';
    let crore = Math.floor(num / 10000000);
    num %= 10000000;
    
    let lakh = Math.floor(num / 100000);
    num %= 100000;
    
    let thousand = Math.floor(num / 1000);
    num %= 1000;
    
    let hundreds = num;
    
    if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore ';
    if (lakh > 0) result += convertLessThanOneThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
    if (hundreds > 0) result += convertLessThanOneThousand(hundreds);
    
    return result.trim();
  }
  
  const wholePart = convert(wholeNumber);
  const decimalPart = decimalNumber > 0 ? ` and ${convert(decimalNumber)} Paise` : '';
  
  return `${wholePart} Rupees${decimalPart} Only`;
}

/**
 * Generate a PDF file and save it
 */
async function generateAndSavePdf(billData, outputPath) {
  try {
    const pdfBuffer = await generatePdfBuffer(billData);
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF saved to ${outputPath}`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
}

module.exports = {
  generatePdfBuffer,
  generateAndSavePdf
};