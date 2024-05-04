const productsRepository = require('./products-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function createProduct(product_name, price, cathegory, quantity) {
  // Hash password
  try {
    await productsRepository.createProduct(product_name, price, cathegory, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

async function getProducts(nomorHalaman, ukuranHalaman, sortir, pencarian) {
  try {
    const products = await productsRepository.getProducts(nomorHalaman, ukuranHalaman, sortir, pencarian);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function updateProduct(id, product_name, price, cathegory, quantity) {
  const product = await productsRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.updateProduct(id, product_name, price, cathegory, quantity);
  } catch (err) {
    return null;
  }

  return true;
}


async function deleteProduct(id) {
  const product = await productsRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,


};