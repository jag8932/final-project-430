const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/market' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username, password: hash, products: [], isPremium: false,
    });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/market' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};
// Upgrades premium status of user to true
const upgradeToPremium = async (req, res) => {
  try {
    const updateAccount = await Account.findOneAndUpdate(
      { _id: req.session.account._id },
      { isPremium: true },
    );
    return res.status(200).json(updateAccount);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'An error occured' });
  }
};
// Upgrades premium status of user to false
const downgradeFromPremium = async (req, res) => {
  try {
    const updateAccount = await Account.findOneAndUpdate(
      { _id: req.session.account._id },
      { isPremium: false },
    );
    return res.status(200).json(updateAccount);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const user = await Account.find({ _id: req.session.account._id });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });
module.exports = {
  loginPage,
  signupPage,
  login,
  logout,
  signup,
  getToken,
  upgradeToPremium,
  downgradeFromPremium,
  getAccountDetails,
  // changePassword,
};
