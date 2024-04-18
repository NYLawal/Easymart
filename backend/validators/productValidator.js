const Joi = require("joi");


function addProductValidator(product) {
    const schema = Joi.object({
      productName: Joi.string()
        .min(5)
        .max(50)
        .required()
        .error(
            new Error(
              "product name cannot be empty and must be between 5 and 50 characters"
            )
          ),
      description: Joi.string()
        .required()
        .min(5)
        .max(255)
        .error(
          new Error(
            "please input a description of the product"
          )
        ),
      category: Joi.string()
        .required()
        .min(5)
        .max(50)
        .error(
          new Error(
            "please input the product's category"
          )
        ),
      price: Joi.string().required().error(
        new Error(
          "please input the product's price"
        )
      ),
      noInStock: Joi.string().required().error(
        new Error(
          "please input how many of this product are in stock"
        )
      ),   
    }).strict();
  
    return schema.validate(product);
  }


  function editProductValidator(product) {
    const schema = Joi.object({
      productName: Joi.string()
        .min(5)
        .max(50)
        .error(
            new Error(
              "product name must be between 5 and 50 characters"
            )
          ),
      description: Joi.string()
        .min(5)
        .max(255)
        .error(
          new Error(
            "please input a description of the product between 5 and 255 characters"
          )
        ),
      category: Joi.string()
        .min(5)
        .max(50)
        .error(
          new Error(
            "please input the product's category between 5 and 50 characters"
          )
        ),
      price: Joi.string().error(
        new Error(
          "please input the product's price"
        )
      ),
      noInStock: Joi.string().error(
        new Error(
          "please input how many of this product are in stock"
        )
      ),
    }).strict();
  
    return schema.validate(product);
  }


  module.exports = {addProductValidator,editProductValidator};