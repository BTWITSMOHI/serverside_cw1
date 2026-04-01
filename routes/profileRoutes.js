
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/profileController');

router.post('/', auth, ctrl.createProfile);

module.exports = router;
