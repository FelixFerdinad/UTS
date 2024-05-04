const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createProducts: {
    body: {
      product_name: joi.string().required().label('product_name'),
      price: joi.number().required().label('price'),
      cathegory: joi.string().required().label('cathegory'),
      quantity: joi.number().required().label('quantity'),
    },
  },

  updateProduct: {
    body: {
      product_name: joi.string().label('product_name'),
      price: joi.number().label('price'),
      cathegory: joi.string().label('cathegory'),
      quantity: joi.number().label('quantity'),
    },
  },

};
