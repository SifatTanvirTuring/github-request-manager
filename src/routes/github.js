const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const auth = require('../middleware/auth');

router.get('/repos/search', auth, githubController.searchRepos);
router.get('/repos/:owner/:repo/users', auth, githubController.getRepoUsers);

module.exports = router;
