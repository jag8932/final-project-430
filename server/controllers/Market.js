const models = require('../models');
const ProductModel = require('../models/Product');

const { Product } = models;

const searchPage = (req, res) => res.render('app');

// Create product function

const createProduct = async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: 'Both a name and description are required!' });
  }
  try {
    const product = Product.create({
      name: req.body.name,
      description: req.body.description,
      user: req.session.account.username,
      userId: req.session.account._id,
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: 'An error occured' });
  }
};
// Delete product function
const deleteProduct = async (req, res) => {
  try {
    const find = await Product.exists({ id: req.query.delete });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(201).json(products);
  } catch (error) {
    return res.status(400).json({ error: 'An error occured' });
  }
};
// Update product function

// Search product function
const searchProduct = async (req, res) => {
  try {
    console.log(req.query);
    const find = await Product.exists({ name: req.query.search });
    console.log(find);
    return res.status(201).json(find);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
// Buy product/add to shopping cart
module.exports = {
  searchPage,
  createProduct,
  searchProduct,
  getProducts,
};
