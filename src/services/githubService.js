const axios = require('axios');
const jwt = require('jsonwebtoken');

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
});

const getAppJwt = () => {
  const privateKey = process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n');
  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + (10 * 60),
    iss: process.env.GITHUB_APP_ID,
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
};

const getInstallationAccessToken = async (installationId) => {
  const jwt = getAppJwt();
  const response = await githubApi.post(`/app/installations/${installationId}/access_tokens`, null, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.data.token;
};

const searchRepos = async (installationId, query) => {
  const accessToken = await getInstallationAccessToken(installationId);
  const response = await githubApi.get('/search/repositories', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
    params: {
      q: `${query} in:name is:private`,
    },
  });
  return response.data;
};

const getRepoUsers = async (installationId, owner, repo) => {
  const accessToken = await getInstallationAccessToken(installationId);
  const response = await githubApi.get(`/repos/${owner}/${repo}/collaborators`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
  return response.data.map(user => ({
    login: user.login,
    permissions: user.permissions
  }));
};

const createRepo = async (installationId, repoName, description) => {
  const accessToken = await getInstallationAccessToken(installationId);
  const response = await githubApi.post('/orgs/YOUR_ORG_NAME/repos', {
    name: repoName,
    description,
    private: true,
  }, {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  return response.data;
};

module.exports = {
  searchRepos,
  getRepoUsers,
  createRepo,
  getInstallationAccessToken,
};
