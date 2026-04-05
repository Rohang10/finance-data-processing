const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getSummary,
  getByCategory,
  getMonthlyTrend,
  getWeeklyTrend,
  getRecentActivity,
} = require('../controllers/dashboardController');

// Dashboard routes accessible to viewer, analyst, and admin
router.use(authenticate, authorize('viewer', 'analyst', 'admin'));

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary (total income, expenses, net)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Summary totals
 *     security:
 *       - bearerAuth: []
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get records grouped by category
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Aggregated totals per category
 *     security:
 *       - bearerAuth: []
 */
router.get('/by-category', getByCategory);

/**
 * @swagger
 * /api/dashboard/monthly-trend:
 *   get:
 *     summary: Get monthly income vs expense trend
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly trend data
 *     security:
 *       - bearerAuth: []
 */
router.get('/monthly-trend', getMonthlyTrend);

/**
 * @swagger
 * /api/dashboard/weekly-trend:
 *   get:
 *     summary: Get weekly income vs expense trend
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Weekly trend data
 *     security:
 *       - bearerAuth: []
 */
router.get('/weekly-trend', getWeeklyTrend);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent financial activity
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of recent records
 *     security:
 *       - bearerAuth: []
 */
router.get('/recent', getRecentActivity);

module.exports = router;
