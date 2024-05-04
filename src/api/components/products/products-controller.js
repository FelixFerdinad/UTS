
const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');/**

 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const product_name = request.body.product_name;
    const price = request.body.price;
    const cathegory = request.body.cathegory;
    const quantity = request.body.quantity;

    const success = await productsService.createProduct(product_name, price, cathegory, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to add product'
      );
    }

    return response.status(200).json({ product_name, price, cathegory, quantity });
  } catch (error) {
    return next(error);
  }
}

async function getProducts(request, response, next) {
  try {
      // menetapkan nilai untuk default jika tidak disediakan 
      const nomorHalaman = parseInt(request.query.page_number) || 1;
      const ukuranHalaman = parseInt(request.query.page_size) || 0;
      const sortir = request.query.sort || 'asc';
      const pencarian = request.query.search || '';

      // menetapkan default sort ke 'asc' jika tidak disediakan atau sort tidak valid


      const products = await productsService.getProducts(nomorHalaman, ukuranHalaman, sortir, pencarian);
      response.status(200).json(products);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};


async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const product_name = request.body.product_name;
    const price = request.body.price;
    const cathegory = request.body.cathegory;
    const quantity = request.body.quantity;
    

    const success = await productsService.updateProduct(id, product_name, price, cathegory, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update Product'
      );
    }

    return response.status(200).json({ id, product_name, price, cathegory, quantity });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete Product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}
//jfjrhjhrtg



module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,

  
};