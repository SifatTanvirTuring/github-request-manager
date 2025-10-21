const RepoRequest = require('../models/repoRequest');
const githubService = require('../services/githubService');

exports.createRequest = async (req, res) => {
  try {
    const { repoName, description } = req.body;
    const request = new RepoRequest({
      repoName,
      description,
      requestor: req.user._id,
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating repository request');
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RepoRequest.find().populate('requestor', 'username');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting repository requests');
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await RepoRequest.findById(req.params.id).populate('requestor');
    if (!request) {
      return res.status(404).send('Request not found');
    }

    await githubService.createRepo(request.requestor.installationId, request.repoName, request.description);

    request.status = 'approved';
    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error approving repository request');
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await RepoRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).send('Request not found');
    }
    request.status = 'rejected';
    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rejecting repository request');
  }
};
