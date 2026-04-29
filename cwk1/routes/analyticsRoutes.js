const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const apiKey = require('../middleware/apiKeyMiddleware');


router.get('/summary', apiKey('read:analytics'), ctrl.getSummary);
router.get('/programme', apiKey('read:analytics'), ctrl.alumniByProgramme);
router.get('/industry', apiKey('read:analytics'), ctrl.industrySectors);
router.get('/jobs', apiKey('read:analytics'), ctrl.jobTitles);
router.get('/employers', apiKey('read:analytics'), ctrl.topEmployers);
router.get('/certifications', apiKey('read:analytics'), ctrl.certificationSkillsGap);
router.get('/graduation-trends', apiKey('read:analytics'), ctrl.graduationTrends);
router.get('/radar-skills', apiKey('read:analytics'), ctrl.radarSkills);
router.get('/usage', apiKey('read:analytics'), ctrl.apiUsageStats);
router.get('/alumni-of-day', apiKey('read:alumni_of_day'), ctrl.getAlumniOfDay);
module.exports = router;
