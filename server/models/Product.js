const mongoose = require('mongoose');

let ProductModel = {};

// A product needs a name, description, date published, and the user trying to sell it
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
  },
  published: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  user: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

// Borrowed code from homeworks
ProductSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return ProductModel.find(search).select('name age').lean().exec(callback);
};

ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
