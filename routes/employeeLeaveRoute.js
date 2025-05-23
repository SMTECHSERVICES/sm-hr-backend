const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const Leave = require("../models/leaveModel.js");
const Employee = require('../models/Employee.js')

router.use(protect);

router.post("/apply",async(req,res)=>{
   try {
     const employeeId = req.employee.id ;
    // console.log(employeeId)
    const {leaveType,fromDate,toDate,reason} = req.body;
    //console.log(req.body)

    const employee = await Employee.findById(employeeId);

    if(!employee){
        return res.status(404).json({
            message:'user does not exist'
        })
    }

    const leave =  new Leave({employee:employeeId,leaveType,fromDate,toDate,reason});
    await leave.save();

    return res.status(200).json({
        message:'Your leave request has been send to your HR Team',
        leaveStatus:"Pending"
    })
   } catch (error) {
        return res.status(500).json({
            message:'Internal server error'
        })
   }
});

router.get('/all',async(req,res)=>{
    
    try {
        const employeeId = req.employee.id ;

     const employee = await Employee.findById(employeeId);

    if(!employee){
        return res.status(404).json({
            message:'user does not exist'
        })
    }
    const leaves = await Leave.find({ employee: employeeId }).sort({ createdAt: -1 });
    
    res.status(200).json({leavesReport:leaves});
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Failed to retrieve leave records' });
  }
})




module.exports = router;