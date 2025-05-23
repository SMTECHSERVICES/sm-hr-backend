// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const generatePayslipPDF = async (payrollData, employeeData) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: 'A4', margin: 50 });
//     const fileName = `payslip_${employeeData._id}_${Date.now()}.pdf`;
//     const pdfDir = path.join(__dirname, '../pdfs');
//     const filePath = path.join(pdfDir, fileName);

//     if (!fs.existsSync(pdfDir)) {
//       fs.mkdirSync(pdfDir);
//     }

//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Paths to logo and watermark
//     const logoPath = path.join(__dirname, '../assets/logo.png');
//     const watermarkPath = path.join(__dirname, '../assets/watermark.png');

//     // Draw watermark image
//     doc.image(watermarkPath, 100, 200, {
//       width: 400,
//       opacity: 0.1,
//     });

//     // Header with company logo and name
//     doc.image(logoPath, 50, 30, { width: 60 });
//     doc.font('Helvetica-Bold').fontSize(20).text('Company Name', 120, 40);
//     doc.fontSize(12).text('Payslip', { align: 'center' });
//     doc.moveDown();

//     // Employee & Payroll Info
//     doc.font('Helvetica').fontSize(12);
//     doc.text(`Employee: ${employeeData.name}`);
//     doc.text(`Email: ${employeeData.email}`);
//     doc.text(
//       `Month: ${new Date(payrollData.month).toLocaleDateString('en-IN', {
//         month: 'long',
//         year: 'numeric',
//       })}`
//     );
//     doc.text(`Generated on: ${new Date().toDateString()}`);
//     doc.moveDown();

//     // Box outline
//     const boxTop = doc.y;
//     const boxHeight = 140;
//     doc.rect(50, boxTop, 500, boxHeight).stroke();

//     // Salary Breakdown
//     const rows = [
//       ['Basic Salary', `\u20B9${payrollData.basicSalary}`],
//       ['HRA', `\u20B9${payrollData.hra}`],
//       ['Bonus', `\u20B9${payrollData.bonus}`],
//       ['Deductions', `\u20B9${payrollData.deductions}`],
//       ['Net Salary', `\u20B9${payrollData.netSalary}`],
//     ];

//     doc.moveDown();
//     doc.font('Helvetica-Bold').text('Salary Breakdown:', 60, boxTop + 10);
//     doc.font('Helvetica');

//     rows.forEach(([label, value], i) => {
//       const y = boxTop + 30 + i * 20;
//       doc.text(label, 70, y);
//       doc.text(value, 400, y);
//     });

//     // Footer
//     doc.fontSize(10).fillColor('gray').text(
//       'This is a system-generated payslip. Please contact HR for any clarifications.',
//       50,
//       760,
//       { align: 'center' }
//     );

//     doc.end();

//     writeStream.on('finish', () => resolve(filePath));
//     writeStream.on('error', reject);
//   });
// };

// module.exports = generatePayslipPDF;


// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const formatCurrency = (num) => `₹ ${Number(num).toLocaleString('en-IN')}`;

// const generatePayslipPDF = async (payrollData, employeeData) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: 'A4', margin: 50 });
//     const fileName = `payslip_${employeeData._id}_${Date.now()}.pdf`;
//     const pdfDir = path.join(__dirname, '../pdfs');
//     const filePath = path.join(pdfDir, fileName);

//     if (!fs.existsSync(pdfDir)) {
//       fs.mkdirSync(pdfDir);
//     }

//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Paths to logo and watermark
//     const logoPath = path.join(__dirname, '../assets/logo.png');
//     const watermarkPath = path.join(__dirname, '../assets/watermark.png');

//     // ✅ Draw watermark image
//     doc.image(watermarkPath, 100, 200, {
//       width: 400,
//       opacity: 0.1,
//     });

//     // ✅ Header with logo and title
//     doc.image(logoPath, 50, 30, { width: 60 });
//     doc.font('Helvetica-Bold').fontSize(20).text('Company Name', 120, 40);
//     doc.fontSize(12).text('Payslip', { align: 'center' });
//     doc.moveDown();

//     // ✅ Employee info
//     doc.font('Helvetica').fontSize(12);
//     doc.text(`Employee: ${employeeData.name}`);
//     doc.text(`Email: ${employeeData.email}`);
//     doc.text(
//       `Month: ${new Date(payrollData.month).toLocaleDateString('en-IN', {
//         month: 'long',
//         year: 'numeric',
//       })}`
//     );
//     doc.text(`Generated on: ${new Date().toDateString()}`);
//     doc.moveDown();

//     // ✅ Box outline
//     const boxTop = doc.y;
//     const boxHeight = 140;
//     doc.rect(50, boxTop, 500, boxHeight).stroke();

//     // ✅ Salary Breakdown
//     const rows = [
//       ['Basic Salary', formatCurrency(payrollData.basicSalary)],
//       ['HRA', formatCurrency(payrollData.hra)],
//       ['Bonus', formatCurrency(payrollData.bonus)],
//       ['Deductions', formatCurrency(payrollData.deductions)],
//       ['Net Salary', formatCurrency(payrollData.netSalary)],
//     ];

//     doc.font('Helvetica-Bold').text('Salary Breakdown:', 60, boxTop + 10);
//     doc.font('Helvetica');

//     rows.forEach(([label, value], i) => {
//       const y = boxTop + 30 + i * 20;
//       doc.text(label, 70, y);
//       doc.text(value, 400, y, { align: 'right' });
//     });

//     // ✅ Footer note
//     doc.fontSize(10).fillColor('gray').text(
//       'This is a system-generated payslip. Please contact HR for any clarifications.',
//       50,
//       760,
//       { align: 'center' }
//     );

//     doc.end();

//     writeStream.on('finish', () => resolve(filePath));
//     writeStream.on('error', reject);
//   });
// };

// module.exports = generatePayslipPDF;



const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePayslipPDF = async (payrollData, employeeData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const fileName = `payslip_${employeeData._id}_${Date.now()}.pdf`;
    const pdfDir = path.join(__dirname, '../pdfs');
    const filePath = path.join(pdfDir, fileName);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Load fonts
    const regularFont = path.join(__dirname, '../fonts/NotoSans-Regular.ttf');
    const boldFont = path.join(__dirname, '../fonts/NotoSans-Bold.ttf');
    doc.registerFont('NotoSans', regularFont);
    doc.registerFont('NotoSans-Bold', boldFont);

    // Load images
    const logoPath = path.join(__dirname, '../assets/logo.png');
    const watermarkPath = path.join(__dirname, '../assets/watermark.png');

    // Add watermark
 doc.image(watermarkPath, 120, 250, {
  width: 300,        // smaller size
  opacity: 0.05      // less bold/faint
});

    // Header
    doc.image(logoPath, 50, 30, { width: 60 });
    // doc.font('NotoSans-Bold').fontSize(20).text('Company Name', 120, 40);
    doc.font('NotoSans-Bold').fontSize(12).text('Payslip', { align: 'center' });
    doc.moveDown();

    // Employee Info
    doc.font('NotoSans').fontSize(12);
    doc.text(`Employee: ${employeeData.name}`);
    doc.text(`Email: ${employeeData.email}`);
    doc.text(
      `Month: ${new Date(payrollData.month).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })}`
    );
    doc.text(`Generated on: ${new Date().toDateString()}`);
    doc.moveDown();

    // Salary Breakdown Box
    const boxTop = doc.y;
    const boxHeight = 140;
    doc.rect(50, boxTop, 500, boxHeight).stroke();

    doc.font('NotoSans-Bold').text('Salary Breakdown:', 60, boxTop + 10);
    doc.font('NotoSans');

    const formatCurrency = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

    const rows = [
      ['Basic Salary', formatCurrency(payrollData.basicSalary)],
      ['HRA', formatCurrency(payrollData.hra)],
      ['Bonus', formatCurrency(payrollData.bonus)],
      ['Deductions', formatCurrency(payrollData.deductions)],
      ['Net Salary', formatCurrency(payrollData.netSalary)],
    ];

    rows.forEach(([label, value], i) => {
      const y = boxTop + 30 + i * 20;
      doc.text(label, 70, y);
      doc.text(value, 400, y);
    });

    // Footer
    doc.fontSize(10).fillColor('gray').text(
      'This is a system-generated payslip. Please contact HR for any clarifications.',
      50,
      760,
      { align: 'center' }
    );

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
};

module.exports = generatePayslipPDF;
