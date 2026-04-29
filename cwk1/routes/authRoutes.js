const authRateLimiter = require('../middleware/authRateLimiter');
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: test@eastminster.ac.uk
 *             password: Password123
 *     responses:
 *       200:
 *         description: User registered
 */
router.post('/register', authRateLimiter, ctrl.registerUser);
router.post('/verify-email', ctrl.verifyEmail);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a verified user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: test@eastminster.ac.uk
 *             password: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', authRateLimiter, ctrl.loginUser);
router.post('/logout', auth, ctrl.logoutUser);
router.post('/request-password-reset', authRateLimiter, ctrl.requestPasswordReset);
router.post('/reset-password', authRateLimiter, ctrl.resetPassword);

module.exports = router;
