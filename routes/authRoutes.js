
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.registerUser);
router.post('/verify-email', ctrl.verifyEmail);
router.post('/login', ctrl.loginUser);
router.post('/logout', auth, ctrl.logoutUser);
router.post('/request-password-reset', ctrl.requestPasswordReset);
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
