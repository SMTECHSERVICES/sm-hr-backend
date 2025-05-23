const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const leaveRoutes = require('./routes/employeeLeaveRoute.js')
const adminAuth = require('./routes/admin/authRoute.js');
const adminEmployee = require('./routes/admin/employeeRoute.js');
const adminLeave = require("./routes/admin/leaveRoute.js");
const payroll = require('./routes/admin/payroll.js')

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin:"*"
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employee', require('./routes/employeeRoutes'));
//app.use('/api/payrolls', require('./routes/payrollRoutes'));
//app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', leaveRoutes);

//ADMIN ROUTES

app.use('/api/admin/auth',adminAuth);
app.use('/api/admin/employees',adminEmployee);
app.use('/api/admin/leave',adminLeave);
app.use('/api/admin/payroll',payroll)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




