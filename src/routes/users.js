const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getAllUsers,
  getUserById,
  createUser,
  createUserValidation,
  updateUser,
  updateUserValidation,
  deleteUser,
} = require('../controllers/userController');
const { param } = require('express-validator');

// All user management routes require authentication + admin role
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Array of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', [param('id').isUUID().withMessage('Invalid user ID'), validate], getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *     security:
 *       - bearerAuth: []
 */
router.post('/', createUserValidation, validate, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', updateUserValidation, validate, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', [param('id').isUUID().withMessage('Invalid user ID'), validate], deleteUser);

module.exports = router;
