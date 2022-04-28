const models = require('../models');

const { Product } = models;

const marketPage = (req, res) => res.render('app');

const redirectPage = (req, res) => res.render('redirect');
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
    Product.findOneAndRemove({ _id: req.query.id }, () => {
      console.log('Product was deleted.');
    });
    return res.status(200).json({ redirect: '/' });
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

const getUserProducts = async (req, res) => {
  try {
    const userProducts = await Product.find({ userId: req.session.account._id });
    return res.status(201).json(userProducts);
  } catch (error) {
    return res.status(400).json({ error: 'An error occured' });
  }
};

// Search product function
const searchProduct = async (req, res) => {
  try {
    const products = await Product.find({ name: req.query.search });
    return res.status(201).json(products);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
// Buy product/add to shopping cart
module.exports = {
  marketPage,
  redirectPage,
  createProduct,
  searchProduct,
  getProducts,
  getUserProducts,
  deleteProduct,
};
