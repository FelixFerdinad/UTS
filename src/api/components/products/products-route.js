const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProducts),
    productsControllers.createProduct
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  route.delete('/:id', authenticationMiddleware, productsControllers.deleteProduct);

};
