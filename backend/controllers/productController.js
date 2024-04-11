const multer = require('multer')              // multer will be used to handle the form data.
const aws = require('aws-sdk')
const multerS3 = require("multer-s3");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { BadUserRequestError, NotFoundError } =
  require('../middleware/errors')
const productInfo = require('../files/productInfo.json')

const {
  addProductValidator
} = require("../validators/productValidator");


const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // cb(null, `image-${productN}.jpeg`);
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });



const addProduct = async (req, res, next) => {
  // let {productName, category, price, noInStock} = req.body
  //  req.body.price = +req.body.price
  //  req.body.noInStock = +req.body.noInStock
  //  console.log(req.body)
  //  console.log(req.file)
  // const { error } = addProductValidator(productInfo);
  // // const { error } = addProductValidator(req.body);
  // if (error) throw error;

  // const { productName, category } = productInfo
  // const productExists = await Product.findOne({ $and: [{ productName }, { category }] })
  // if (productExists) throw new BadUserRequestError("Error: product has already been created");

  const uploadSingle = upload().single("productImage");
  uploadSingle(req, res, async (err) => {
    console.log(req.file)
    if (err)
   
      throw new BadUserRequestError(`Error:${err.message}`);
    const image_url = req.file.location
   console.log(req.body)

    // const newProduct = await Product.create({ ...req.body, image_url: image_url, addedBy: req.user._id, 'admin name': req.user.fullName });
    const newProduct = await Product.create({ ...req.body, image_url: image_url});
    res.status(200).json({ status: "Success", msg: "product created successfully" });
  });


}




module.exports = { addProduct }

// let photo = document.getElementById("image-file").files[0];
// let formData = new FormData();
     
// formData.append("photo", photo);
// fetch('/upload/image', {method: "POST", body: formData});

