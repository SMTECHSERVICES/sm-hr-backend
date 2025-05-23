// models/Payroll.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Date, required: true }, // e.g., 'May 2025'
  basicSalary: Number,
  hra: Number,
  bonus: Number,
  deductions: Number,
  netSalary: Number,
  generatedDate: { type: Date, default: Date.now },
  pdfUrl: { type: String } // cloud storage URL
});

module.exports = mongoose.model('Payroll', payrollSchema);
