const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const githubService = require('../services/githubService');

exports.githubLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/apps/YOUR_APP_NAME/installations/new`;
  res.redirect(githubAuthUrl);
};

exports.githubCallback = async (req, res) => {
  const { installation_id } = req.query;

  try {
    const accessToken = await githubService.getInstallationAccessToken(installation_id);

    const githubUser = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    let user = await User.findOne({ githubId: githubUser.data.id });

    if (!user) {
      user = new User({
        githubId: githubUser.data.id,
        username: githubUser.data.login,
        accessToken: accessToken,
        installationId: installation_id,
      });
      await user.save();
    } else {
      user.accessToken = accessToken;
      user.installationId = installation_id;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during GitHub authentication');
  }
};
