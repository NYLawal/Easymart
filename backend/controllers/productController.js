const User = require("../models/userModel");
const Product = require("../models/productModel");
const  { BadUserRequestError, NotFoundError } = 
require('../middleware/errors')

const {
  addProductValidator
} = require("../validators/productValidator");

const addProduct =  async(req, res, next) => {
  const { error } = addProductValidator(req.body);
  if (error) throw error;

  const {productName, category} = req.body
  const productExists = await Product.findOne({ $and: [{productName}, {category}]})
    if (productExists) throw new BadUserRequestError("Error: product has already been created");
    
  const newProduct = await Product.create({...req.body, addedBy: req.user._id, 'admin name':req.user.fullName});
  res.status(201).json({ status: "Success", newProduct, msg: "product created successfully" }); 

}

module.exports = { addProduct}

