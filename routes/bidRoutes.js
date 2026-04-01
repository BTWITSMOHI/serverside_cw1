
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bidController');

router.post('/', auth, ctrl.placeBid);
router.post('/select-winner', ctrl.selectWinner);

module.exports = router;
