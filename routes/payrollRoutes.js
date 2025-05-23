const express = require('express');
const Payroll = require('../models/Payroll.js');
const Employee = require('../models/Employee.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();
const PDFDocument = require('pdfkit');
const roleMiddleware = require('../middleware/roleMiddleware.js');
// const {
//   createPayroll,
//   getPayrolls,
//   getPayrollById,
//   updatePayroll,
//   deletePayroll,
//   generatePayslipPDF,
//   exportPayrollCSV
// } = require('../controllers/payrollController.js');



// Generate payroll
router.post('/', protect, async (req, res) => {
  const { employeeId, month, basic, hra, deductions } = req.body;
  const totalSalary = basic + hra - deductions;

  const payroll = new Payroll({
    employee: employeeId,
    month,
    basic,
    hra,
    deductions,
    totalSalary
  });

  await payroll.save();
  res.status(201).json(payroll);
});

// Get all payrolls
router.get('/', protect, async (req, res) => {
  const payrolls = await Payroll.find().populate('employee');
  res.json(payrolls);
});

// Generate Payslip 

router.get('/:id/payslip', protect, async (req, res) => {
  const payroll = await Payroll.findById(req.params.id).populate('employee');
  if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

  const doc = new PDFDocument();
  let filename = `payslip-${payroll.employee.name}-${payroll.month}.pdf`;

  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  doc.fontSize(20).text('SM-HR Pro - Payslip', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Employee Name: ${payroll.employee.name}`);
  doc.text(`Month: ${payroll.month}`);
  doc.text(`Basic: ₹${payroll.basic}`);
  doc.text(`HRA: ₹${payroll.hra}`);
  doc.text(`Deductions: ₹${payroll.deductions}`);
  doc.text(`Total Salary: ₹${payroll.totalSalary}`);
  doc.moveDown();
  doc.text('Thank you for using SM-HR Pro!', { align: 'center' });

  doc.end();
});

// Export Payroll to CSV

const { Parser } = require('json2csv');

router.get('/export/csv', protect, roleMiddleware('admin'), async (req, res) => {
  const payrolls = await Payroll.find().populate('employee');

  const data = payrolls.map(p => ({
    name: p.employee.name,
    email: p.employee.email,
    month: p.month,
    basic: p.basic,
    hra: p.hra,
    deductions: p.deductions,
    totalSalary: p.totalSalary,
  }));

  const parser = new Parser();
  const csv = parser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('payroll-export.csv');
  return res.send(csv);
});

// Get payrolls of logged-in employee
router.get('/mine', protect, async (req, res) => {
  const payrolls = await Payroll.find({ employee: req.user.employeeId });
  res.json(payrolls);
});

module.exports = router;
