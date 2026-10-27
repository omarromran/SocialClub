const validation = require('../../frontend/validation');

function use(rule) {
  return (req, res, next) => {
    const error = rule(req.body || {});
    if (error) return res.status(400).json({ error });
    next();
  };
}

function requireObjectBody(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'A valid request body is required.' });
  }
  return next();
}

const validateSignup = use(validation.signup);
const validateLogin = use(validation.login);
const validateProfile = use(validation.profile);
const validatePasswordChange = use(validation.passwordChange);
const validateFeedback = use(validation.feedback);
const validateDeleteAccount = use(validation.deleteAccount);
const validateSystemPost = use(validation.systemPost);

module.exports = { requireObjectBody, validateSignup, validateLogin, validateProfile, validatePasswordChange, validateFeedback, validateDeleteAccount, validateSystemPost };
