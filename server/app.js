const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// const dbURL = 'mongodb+srv://jacobUser:jacobPassword0@cluster0.tzvux.mongodb.net/DomoMaker';
mongoose.connect(dbURL, (err) => {
  if (err) {
    //   console.log('Could not connect to database');
    throw err;
  }
});

// Pull in our routes
const router = require('./router.js');

// App
const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use(session({
    key: 'sessionid', 
    secret: 'Domo Arigato',
    resave: true,
    saveUninitialized: true,
}));
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  // console.log(`Listening on port ${port}`);
});
