const validation = require('../../frontend/validation');

function use(rule) {
  return (req, res, next) => {
    const error = rule(req.body || {});
    if (error) return res.status(400).json({ error });
    next();
  };
}

const validateSignup = use(validation.signup);
const validateLogin = use(validation.login);
const validateProfile = use(validation.profile);
const validatePasswordChange = use(validation.passwordChange);
const validateFeedback = use(validation.feedback);
const validateDeleteAccount = use(validation.deleteAccount);
const validateSystemPost = use(validation.systemPost);

module.exports = { validateSignup, validateLogin, validateProfile, validatePasswordChange, validateFeedback, validateDeleteAccount, validateSystemPost };
