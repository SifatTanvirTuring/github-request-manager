const express = require('express');
const router = express.Router();
const repoRequestController = require('../controllers/repoRequestController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, repoRequestController.createRequest);
router.get('/', auth, admin, repoRequestController.getAllRequests);
router.put('/:id/approve', auth, admin, repoRequestController.approveRequest);
router.put('/:id/reject', auth, admin, repoRequestController.rejectRequest);

module.exports = router;
