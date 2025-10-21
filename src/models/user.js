const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  accessToken: { type: String, required: true },
  installationId: { type: String },
});

module.exports = mongoose.model('User', userSchema);
