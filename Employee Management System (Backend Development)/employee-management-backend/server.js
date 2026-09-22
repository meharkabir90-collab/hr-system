const dotenv = require('dotenv');
dotenv.config();


const express = require("express");
const authRoutes = require('./Routes/authRoutes')
const candidateAuthRoutes = require('./Routes/candidateAuthRoutes')
const departmentRoutes = require('./Routes/departmentRoutes')
const employeeRoutes = require('./Routes/employeeRoutes')
const attendanceRoutes = require('./Routes/attendanceRoutes')
const errorMiddleware = require('./middleware/errorMiddleware')
const leaveRoutes = require('./Routes/leaveRoutes')
const superAdminRoutes = require('./Routes/superAdminRoutes')
const payrollRoutes = require('./Routes/payrollRoutes')
const jobRoutes = require('./Routes/jobRoutes')
const jobApplicationRoutes = require('./Routes/jobApplicationRoutes')

const swaggerSpec = require('./config/swagger')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  explorer: true,
}

<<<<<<< HEAD
=======

>>>>>>> b19f37247ea228a67f341897c124040a9971ddc8

const app = express();
app.use(express.json());

<<<<<<< HEAD
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true

})
);

=======
>>>>>>> b19f37247ea228a67f341897c124040a9971ddc8




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const dbConnect = require('./config/db');
dbConnect();


// auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate-auth', candidateAuthRoutes);

// department Routes
app.use('/api/department', departmentRoutes);

//employee Routes
app.use('/api/employee', employeeRoutes);

//attendance Routes
app.use('/api/attendance', attendanceRoutes);

//leave Routes
app.use('/api/leave', leaveRoutes);

// payroll Routes
app.use('/api/payroll', payrollRoutes);

// job Routes
app.use('/api/job', jobRoutes);

// job application Routes
app.use('/api/job-application', jobApplicationRoutes);

//superadmin Routes
app.use('/api/superadmin', superAdminRoutes);

//swagger documentation
<<<<<<< HEAD
=======
//swagger documentation
>>>>>>> b19f37247ea228a67f341897c124040a9971ddc8
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

app.get("/", (req, res) => {
    res.send("Employee Management API Running");
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Error middleware 
app.use(errorMiddleware);







