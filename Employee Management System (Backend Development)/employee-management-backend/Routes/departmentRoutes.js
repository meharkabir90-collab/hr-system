const express = require('express');
const router = express.Router();
const {  createDepartment,
    getDepartments,
    getDepartmentById,
    assignManager,
    updateDepartment,
    deleteDepartment } = require('../controller/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware  = require('../middleware/adminMiddleware');

console.log(createDepartment);
console.log(authMiddleware);
console.log(adminMiddleware);


/**
 * @swagger
 * /api/department/:
 *   post:
 *     summary: Register a new Department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Science
 *               description:
 *                 type: string
 *                 example: Focusing on developing problem solving and software development skills.
 *     responses:
 *       200:
 *         description: Registered successfully
 *       400:
 *         description: Bad Request
 */
router.post("/", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), createDepartment);



/**
 * @swagger
 * /api/department/{id}:
 *   put:
 *     summary: Update a Department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 6870f6d8b4e6c1f8a1234567
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), updateDepartment);



/**
 * @swagger
 * /api/department/{id}:
 *   delete:
 *     summary: Delete a Department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 6870f6d8b4e6c1f8a1234567
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), deleteDepartment);



/**
 * @swagger
 * /api/department/:
 *   get:
 *     summary:  Read Existing Departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments get successfully
 *       400:
 *         description: Bad Request
 */
router.get("/", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getDepartments);

/**
 * @swagger
 * /api/department/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 6870f6d8b4e6c1f8a1234567
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getDepartmentById);

router.put("/:id/manager", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), assignManager);

module.exports = router;
