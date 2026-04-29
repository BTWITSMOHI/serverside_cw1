
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/profileController');
const extra = require('../controllers/profileExtraController');
const checkProfileExists = require('../middleware/checkProfileExists');
router.post('/createProfile', auth, checkProfileExists, ctrl.createProfile);
/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create a user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             full_name: Mohi Mohammed
 *             bio: Software Engineering student
 *             linkedin_url: https://linkedin.com/in/mohi
 *     responses:
 *       200:
 *         description: Profile created successfully
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/profile/createProfile:
 *   post:
 *     summary: Create a user profile (only once)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile created successfully
 *       400:
 *         description: Profile already exists
 */
router.post('/createProfile', auth, ctrl.createProfile);
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get('/', auth, ctrl.getProfile);
/*
router.get(`/', auth, ctrl.getProfile);
router.put('/', auth, ctrl.updateProfile);
router.delete('/', auth, ctrl.deleteProfile);
routee.post('/createProfile', auth, ctrl.createProfile);
router.post('/addDegree', auth, ctrl.addDegree);
router.delete(('/deleteDegree/:id', auth, ctrl.deleteDegree);)
*/ 

/**
 * @swagger
 * /api/profile/degree:
 *   post:
 *     summary: Add a degree
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             degree_name: BSc Software Engineering
 *             institution: University of Westminster
 *             year: 2026
 *     responses:
 *       200:
 *         description: Degree added
 */
router.post('/degree', auth, extra.addDegree);

/**
 * @swagger
 * /api/profile/certification:
 *   post:
 *     summary: Add a certification
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: AWS Certified Developer
 *             issuer: Amazon
 *             year: 2025
 *     responses:
 *       200:
 *         description: Certification added
 */
router.post('/certification', auth, extra.addCertification);

/**
 * @swagger
 * /api/profile/employment:
 *   post:
 *     summary: Add employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             company: Google
 *             role: Software Engineer Intern
 *             start_date: 2024-06-01
 *             end_date: 2024-09-01
 *     responses:
 *       200:
 *         description: Employment added
 */
router.post('/employment', auth, extra.addEmployment);


module.exports = router;
