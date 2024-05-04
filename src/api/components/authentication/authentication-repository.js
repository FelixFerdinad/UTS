const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function addFailedLoginAttempt(email) {
  const filter = { email };
  const update = { $inc: { loginAttempts: 1 }, lastFailedAttempt: Date.now() };
  await User.findOneAndUpdate(filter, update, { upsert: true });
}

async function getLastFailedAttempt(email) {
  const user = await User.findOne({ email });
  return user ? user.lastFailedAttempt : null;
}

async function getLoginAttempts(email) {
  const user = await User.findOne({ email });
  return user ? user.loginAttempts : 0;
}

async function resetLoginAttempts(email) {
  const filter = { email };
  const update = { loginAttempts: 0 };
  await User.findOneAndUpdate(filter, update);
}

module.exports = {
  getUserByEmail,
  addFailedLoginAttempt,
  getLastFailedAttempt,
  getLoginAttempts,
  resetLoginAttempts,
};
