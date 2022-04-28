const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  app.get('/getProducts', controllers.Market.getProducts);
  app.post('/createProduct', mid.requiresLogin, controllers.Market.createProduct);

  app.get('/deleteProduct', mid.requiresLogin, controllers.Market.deleteProduct);

  app.get('/getUserProducts', mid.requiresLogin, controllers.Market.getUserProducts);

  app.get('/searchFor', controllers.Market.searchProduct);

  app.post('/upgrade', mid.requiresLogin, controllers.Account.upgradeToPremium);
  app.post('/downgrade', mid.requiresLogin, controllers.Account.downgradeFromPremium);
  app.get('/getPremiumStatus', mid.requiresLogin, controllers.Account.getAccountDetails);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // /changePassword

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/market', mid.requiresLogin, controllers.Market.marketPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Market.redirectPage);
};

module.exports = router;
