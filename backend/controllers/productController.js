const multer = require("multer"); // multer will be used to handle the form data.
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { BadUserRequestError, NotFoundError } = require("../middleware/errors");
const productInfo = require("../files/productInfo.json");

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
      // acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const fileName = "img" + Date.now() + "_" + file.originalname;
        cb(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else return cb(new BadUserRequestError("Invalid file type"));
    },
  });

const uploadImg = async (req, res, next) => {
  const uploadSingle = upload().single("productImage");
  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(404).end("file exceeds accepted standard!");
    } else if (err) {
      return res.status(404).end(err.message);
    } else if (!req.file) {
      return res.status(404).end("File is required!");
    }
  // if image uploads successfully, get url of image and pass to the next middleware
    req.image_url = req.file.location;
    next();
  });
};

const addProduct = async (req, res, next) => {
  const { error } = addProductValidator(req.body);
  if (error) throw error;
  // change user input to number
  req.body.price = parseFloat(req.body.price);
  req.body.noInStock = parseInt(req.body.noInStock);

  const { productName, category } = req.body;
  const productExists = await Product.findOne({
    $and: [{ productName }, { category }],
  });
  if (productExists)
    throw new BadUserRequestError("Error: product has already been created");

  const newProduct = await Product.create({
    ...req.body,
    image_url: req.image_url, //coming from the uploadImg middleware
    addedBy: req.user.fullName,
  });
  res
    .status(200)
    .json({
      status: "Success",
      msg: "product created successfully",
      newProduct,
    });
};

module.exports = { uploadImg, addProduct };


