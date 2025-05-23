// routes/payroll.js
const express = require('express');
const router = express.Router();
const Payroll = require('../../models/Payroll.js');
const Employee = require('../../models/Employee.js');
const generatePayslipPDF = require('../../utils/pdfGenerator.js');
const uploadFileOnCloudinary = require('../../utils/uploadFileOnCloudinary.js')
const fs = require('fs');



router.post('/generate/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    console.log(employeeId)
    const { month, basicSalary, hra, bonus, deductions } = req.body;
    console.log(req.body)

    // Validate Employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
console.log(employee)
    // Calculate Net Salary
    const netSalary =
      Number(basicSalary) + Number(hra) + Number(bonus) - Number(deductions);

    // Create Payroll Entry
    const payroll = new Payroll({
      employee: employeeId,
      month: new Date(`${month}-01`), // Convert "May 2025" to Date
      basicSalary,
      hra,
      bonus,
      deductions,
      netSalary,
    });

    const savedPayroll = await payroll.save();

    console.log(savedPayroll)

    // Generate PDF + Upload
    const filePath = await generatePayslipPDF(savedPayroll, employee);
    console.log('This is file path',filePath)
    const pdfUrl = await uploadFileOnCloudinary(filePath);
    console.log('this is pdf url from cloudinary',pdfUrl)

    savedPayroll.pdfUrl = pdfUrl;
    await savedPayroll.save();
    console.log(savedPayroll)

    // Optional: Delete local file
    // fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Payroll generated successfully',
      payroll: savedPayroll,
    });
  } catch (err) {
    console.error('Payroll Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate payslip' });
  }
});

module.exports = router;
