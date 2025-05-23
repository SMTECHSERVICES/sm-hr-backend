const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const User = require('../models/User.js');
const Employee = require('../models/Employee.js');
const upload = require('../middleware/multer.js');
const uplaodOnCloudinary = require('../utils/uploadOnCloudinary.js')
const router = express.Router();



// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password)
  const employee = await Employee.findOne({ email });

  if (!employee || !bcrypt.compareSync(password, employee.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: employee._id}, process.env.JWT_SECRET);
  res.status(200).json({ token });
});

// Register (optional - for testing)
router.post('/register',upload.single('avatar') ,async (req, res) => {
try {
  const avatar = req.file;
    const { name, email, password, role,salary,department } = req.body;
    console.log(avatar)
    console.log(req.body)

   const image_url = await uplaodOnCloudinary(avatar.path)
   console.log(image_url)
  //console.log(req.body);
  const hashedPassword = bcrypt.hashSync(password, 10);
  const employee = new Employee({ name, email, password: hashedPassword,salary, role,department,avatar:image_url });

  await employee.save();
  const token = jwt.sign({ id: employee._id}, process.env.JWT_SECRET);
  //console.log(token)
  return res.status(200).json({ message: 'new employee account created',token });
} catch (error) {
  return res.status(500).json({
    message:'internal server error'
  })
}
});

module.exports = router;
