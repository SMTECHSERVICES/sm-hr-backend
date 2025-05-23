const express = require('express');
const Employee = require('../models/Employee');
const { protect } = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');
const Attendance = require('../models/Attendance.js')
const Payroll = require('../models/Payroll.js')
const router = express.Router();

router.use(protect)

// GET all employees
router.get('/me', async (req, res) => {
 // console.log(req.employee)
  try {
    const employee = await Employee.findById(req.employee.id).select('-password');
   return res.json(employee);
  } catch (error) {
    return res.status(500).json({message:'internal server error'});
  }
});

router.get('/attendance/me', async (req, res) => {
 // console.log(req.employee,"it is from attendance")
try {
    const employee = await Employee.findById(req.employee.id).select('-password');
  const attendance = await Attendance.findOne({ employee: req.employee.id });
 // console.log(attendance)
   return  res.json({
      attendanceReport: attendance ? attendance.attendanceReport : []
    });
} catch (error) {
  return res.status(500).json({message:'internal server error'});
}
});

router.post('/mark-attendance',async(req,res)=>{
  const { status, date } = req.body;
    const employeeId = req.employee.id;
   // console.log(req.body)

    if (!['Present', 'Absent', 'Leave'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }
    
//console.log('hello')


    try {
      const employee = await Employee.findById(employeeId);
    if(!employee){
      return res.status(404).json({
        message:'this employee does not exist'
      })
    }
   // console.log('hidf')
    // Check if attendance document exists
    let attendance = await Attendance.findOne({ employee: employeeId });

    if (!attendance) {
      // Create new record
      attendance = new Attendance({
        employee: employeeId,
        attendanceReport: [{ date, status }],
      });
      //console.log('if ke andar')
    } else {
      // Check if this date already exists
      const alreadyMarked = attendance.attendanceReport.find(
        (entry) => new Date(entry.date).toDateString() === new Date(date).toDateString()
      );
      //console.log('aleready marked')

      if (alreadyMarked) {
        return res.status(400).json({ message: 'Attendance already marked for this date.' });
      }
      //console.log('already mark ke bad')

      // Add new attendance entry
      attendance.attendanceReport.push({ date, status });
      //console.log('array me push')
    }

    await attendance.save();
    //console.log('attendance save hogatya')
    res.status(200).json({ message: 'Attendance marked successfully.', attendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error.' });
  }

})

// GET payroll by employee ID
router.get('/payroll', async (req, res) => {
  const payrolls = await Payroll.find({ employee: req.employee.id }).sort({ generatedDate: -1 });
  res.json(payrolls);
});




// POST new employee
// router.post('/',protect,  async (req, res) => {
//   const {name,email,salary,role,department} = req.body;
//   const employee = new Employee({
//     name,
//     email,
//     salary,
//     role,
//     department
//   });
//   const newEmp = await employee.save();
//   res.status(201).json(newEmp);
// });

// router.get('/adminAccess', protect, roleMiddleware('admin'), async (req, res) => {
//   const employees = await Employee.find();
//   res.json(employees);
// });
module.exports = router;
