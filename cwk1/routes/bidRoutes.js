
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bidController');

/**
 * @swagger
 * /api/bids:
 *   post:
 *     summary: Place a blind bid
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             amount: 100
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid bid
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, ctrl.placeBid);

/**
 * @swagger
 * /api/bids/select-winner:
 *   post:
 *     summary: Select the highest bid as winner
 *     tags: [Bids]
 *     responses:
 *       200:
 *         description: Winner selected successfully
 */
router.post('/select-winner', ctrl.selectWinner);

module.exports = router;
