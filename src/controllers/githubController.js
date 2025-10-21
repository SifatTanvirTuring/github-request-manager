const githubService = require('../services/githubService');

exports.searchRepos = async (req, res) => {
  try {
    const { q } = req.query;
    const repos = await githubService.searchRepos(req.user.installationId, q);
    res.json(repos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching repositories');
  }
};

exports.getRepoUsers = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const users = await githubService.getRepoUsers(req.user.installationId, owner, repo);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting repository users');
  }
};
