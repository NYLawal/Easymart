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
      price: Joi.number().required().error(
        new Error(
          "please input the product's price"
        )
      ),
      noInStock: Joi.number().min(1).error(
        new Error(
          "please input the number of this product in stock, it cannot be 0 or less"
        )
      ),
    // //   image: Joi.image().error(
    // //     new Error(
    // //       "please add at least one image for this product"
    // //     )
    //   ),
   
    }).strict();
  
    return schema.validate(product);
  }


  module.exports = {addProductValidator};