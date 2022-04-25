const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  app.get('/getProducts', controllers.Market.getProducts);
  app.post('/createProduct', mid.requiresLogin, controllers.Market.createProduct);

  app.get('/searchFor', controllers.Market.searchProduct);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/market', mid.requiresLogin, controllers.Market.searchPage);

  // app.get('/maker', mid.requiresLogin,controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin,controllers.Domo.makeDomo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
