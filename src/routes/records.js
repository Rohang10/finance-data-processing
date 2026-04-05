const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { param } = require('express-validator');
const {
  getAllRecords,
  getRecordById,
  createRecord,
  createRecordValidation,
  updateRecord,
  updateRecordValidation,
  deleteRecord,
} = require('../controllers/recordController');

// All record routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Array of financial records
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authorize('analyst', 'admin'), getAllRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single financial record by ID
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Financial record object
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', [
  authorize('analyst', 'admin'),
  param('id').isUUID().withMessage('Invalid record ID'),
  validate,
], getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record (admin only)
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, category, date, description]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *               category:
 *                 type: string
 *                 example: Revenue
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-01"
 *               description:
 *                 type: string
 *                 example: Monthly subscription income
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize('admin'), createRecordValidation, validate, createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a financial record (admin only)
 *     tags: [Records]
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
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *     responses:
 *       200:
 *         description: Record updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', authorize('admin'), updateRecordValidation, validate, updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a financial record (admin only)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Record deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', [
  authorize('admin'),
  param('id').isUUID().withMessage('Invalid record ID'),
  validate,
], deleteRecord);

module.exports = router;
