const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  salary: Number,
  password:String,
  department: String,
    role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  avatar:{
    type:String,
    require:true
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
