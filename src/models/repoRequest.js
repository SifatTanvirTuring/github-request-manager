const mongoose = require('mongoose');

const repoRequestSchema = new mongoose.Schema({
  repoName: { type: String, required: true },
  description: { type: String },
  requestor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('RepoRequest', repoRequestSchema);
