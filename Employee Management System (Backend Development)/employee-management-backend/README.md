# Employee Management System - Backend

A RESTful API built with Node.js, Express.js, and MongoDB for managing employees, departments, and user authentication. This backend provides secure authentication and complete CRUD operations for departments and employees.

---

## 🚀 Features

### 🔐 Authentication Module
- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Input Validation using Joi

### 🏢 Department Module
- Create Department
- Get All Departments
- Get Department by ID
- Update Department
- Delete Department

### 👨‍💼 Employee Module
- Add Employee
- Get All Employees
- Get Employee by ID
- Update Employee
- Delete Employee
- Assign Employee to Department

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- Joi
- dotenv
- Nodemon

---

## 📁 Project Structure

```
employee-management-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── departmentController.js
│   └── employeeController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── validationMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Department.js
│   └── Employee.js
│
├── routes/
│   ├── authRoutes.js
│   ├── departmentRoutes.js
│   └── employeeRoutes.js
│
├── validators/
│   ├── authValidation.js
│   ├── departmentValidation.js
│   └── employeeValidation.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Navigate to Project

```bash
cd employee-management-backend
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Development Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

---

### Department

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/departments | Create Department |
| GET | /api/departments | Get All Departments |
| GET | /api/departments/:id | Get Department by ID |
| PUT | /api/departments/:id | Update Department |
| DELETE | /api/departments/:id | Delete Department |

---

### Employee

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/employees | Create Employee |
| GET | /api/employees | Get All Employees |
| GET | /api/employees/:id | Get Employee by ID |
| PUT | /api/employees/:id | Update Employee |
| DELETE | /api/employees/:id | Delete Employee |

---

## 🔒 Authentication

Protected routes require a JWT token.

Example Header:

```http
Authorization: Bearer your_jwt_token
```

---

## ✅ Validation

The API uses **Joi** for validating request data before processing.

---

## 🔐 Security

- Passwords are encrypted using bcrypt.
- JWT is used for secure authentication.
- Environment variables are managed using dotenv.
- Input validation prevents invalid requests.

---

## 👨‍💻 Author

**Muhammad Kabeer**

Backend Developer | MERN Stack Developer