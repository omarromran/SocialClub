function validateSignup(req, res, next) {
  const { email, username, password, confirmPassword } = req.body;
  if (!email || !username || !password || !confirmPassword) return res.status(400).json({ error: 'All signup fields are required.' });
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) return res.status(400).json({ error: 'Username must be 3-30 letters, numbers, or underscores.' });
  next();
}

function validateLogin(req, res, next) {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Username/email and password are required.' });
  next();
}

module.exports = { validateSignup, validateLogin };
