const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

// The account schema is updated to have products. All accounts will have
// access to the products they are selling on the market. Products must be objects.
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  products: [Object],
  shoppingCart: [Object],
  isPremium: {
    type: Boolean,
    required: true,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.validatePassword = async (username, oldpassword) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();

    const match = await bcrypt.compare(oldpassword, doc.password);
    if (match) {
      return true;
    }
    return false;
  } catch (err) {
    return console.log(err);
  }
};

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
