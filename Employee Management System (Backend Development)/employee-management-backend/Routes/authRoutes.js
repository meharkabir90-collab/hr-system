const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controller/authController');
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john david
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john123@gmail.com
 *               password:
 *                 type: string
 *                 example: kabir12345
 *               confirmPassword:
 *                 type: string
 *                 example: kabir12345
 *               role:
 *                 type: string
 *                 example: employee
 *     responses:
 *       200:
 *         description: Registered successfully
 *       400:
 *         description: Bad Request
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john david
 *               password:
 *                 type: string
 *                 example: kabir12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);


router.post("/logout", authMiddleware, logout);



module.exports = router;