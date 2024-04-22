const multer = require("multer"); // multer will be used to handle the form data.
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const _ = require("lodash");
const {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
// user-defined modules
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { BadUserRequestError, NotFoundError } = require("../middleware/errors");
const {
  addProductValidator,
  editProductValidator,
} = require("../validators/productValidator");
const { validateMongoId } = require("../validators/mongoIdValidator");

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
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

  if (productExists) {
    // delete product image just saved in bucket, then throw error
    const productImageURL = req.image_url;
    const productImage = productImageURL
      .split("s3.us-west-2.amazonaws.com/")
      .pop();
    const doneDelete = await deleteFile(productImage);
    if (doneDelete) console.log("deleted the saved file", productImage);
    throw new BadUserRequestError("Error: product has already been created");
  }
  const newProduct = await Product.create({
    ...req.body,
    image_url: req.image_url, //coming from the uploadImg middleware
    addedBy: req.user.fullName,
  });

  res.status(200).json({
    status: "Success",
    message: "product created successfully",
    newProduct,
  });
};

const getAllProducts = async (req, res, next) => {
  let pageNumber = req.query.pageNumber;
  if (!pageNumber) pageNumber = 1;
  const pageSize = 8;

  const products = await Product.find({})
    .sort({ productName: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select("-images -createdAt -updatedAt -__v");

  if (!products) throw new NotFoundError("Error: No products found!");
  else {
    res.status(200).json({
      status: "Success",
      message: `${products.length} products found`,
      products,
    });
  }
};

const getOneProduct = async (req, res, next) => {
  const productId = req.params.id;

  const { error } = validateMongoId(req.params);
  if (error)
    throw new BadUserRequestError(
      "Please pass in a valid mongoId for the product"
    );

  const product = await Product.findById({ _id: productId }).select(
    "-images -createdAt -updatedAt -__v"
  );
  if (!product) throw new NotFoundError("Error: No such product found");
  res.status(200).json({
    status: "Success",
    message: "Product found",
    product,
  });
};

const getProductsbyCategory = async (req, res, next) => {
  let pageNumber = req.query.pageNumber;
  if (!pageNumber) pageNumber = 1;
  const pageSize = 8;

  const category = req.query.category;
  console.log(category);
  console.log(pageNumber);
  if (!category || category == "")
    return next(new Error("Error: please specify a valid category"));

  const products = await Product.find({ category })
    .sort({ category: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select("-images -createdAt -updatedAt -__v");

  if (products.length == 0)
    throw new NotFoundError("Error: no such products found");

  res.status(200).json({
    status: "Success",
    message: `${products.length} products found`,
    products,
  });
};

const getProductsbySearch = async (req, res, next) => {
  let pageNumber = req.query.pageNumber || 1;
  // if (!pageNumber) pageNumber = 1;
  const pageSize = req.query.pageSize || 8;

  const keyword = req.params.keyword;
  if (!keyword) {
    throw new BadUserRequestError(
      "Input a valid search term for the product(s)"
    );
  }

  const products = await Product.find({
    $or: [
      { productName: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ],
  })
    .sort({ keyword: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select("-images -createdAt -updatedAt -__v");

  if (products.length < 1) {
    throw new NotFoundError(`No products meet your search for ${keyword}`);
  }

  res.status(200).json({
    status: "Success",
    message: `${products.length} products found`,
    products,
  });
};

const editImg = async (req, res, next) => {
  const uploadSingle = upload().single("productImage");
  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(404).end("file exceeds accepted standard!");
    } else if (err) {
      return res.status(404).end(err.message);
    } else if (!req.file) {
      // return "no image"
      req.file = {};
      next();
      return;
      console.log(req.file);
    }
    // if image uploads successfully, get url of image and pass to the next middleware
    // return req.image_url = req.file.location;
    req.image_url = req.file.location;
    next();
  });
};

const editProduct = async (req, res, next) => {
  const productId = req.params.id;
  // check if id is a valid MongoId
  const { error } = validateMongoId(req.params);
  if (error)
    throw new BadUserRequestError(
      "Please pass in a valid mongoId for the product"
    );

  // check if product exists in database
  const product = await Product.findById({ _id: productId });
  if (!product) throw new NotFoundError("Error:no such product found!");

  // check if new image url is present in the request, get the previous url of the product image from database,
  //  extract the filename and delete the image from AWS bucket. Then update with the new file specified
  if (req.image_url) {
    const productImageURL = product.image_url;
    const productImage = productImageURL
      .split("s3.us-west-2.amazonaws.com/")
      .pop();
    const data = await deleteFile(productImage);

    // if previous image is found and successfully deleted, attach new image url to req.body
    const newImageURL = req.image_url;
    if (data) req.body.image_url = newImageURL;
    else {
      // if previous image is not found in bucket, delete new image just uploaded
      const newProductImage = newImageURL
        .split("s3.us-west-2.amazonaws.com/")
        .pop();
      const doneDelete = await deleteFile(newProductImage);
      if (doneDelete) console.log("deleted new file", newProductImage);
      throw new NotFoundError("Error: Previous product image is not found in S3, cannot add a new one")
    }
  }
  else { // if image url is not to be updated, that is, no file in request, then check if req.body is not empty
    // request needs to have a body, a file, or both
    if (Object.keys(req.body).length === 0)
      throw new BadUserRequestError("Error: Nothing specified for update");
  }

  // validate input in req.body
  const editProductValidatorResponse = editProductValidator(req.body);
  const editProductValidatorError = editProductValidatorResponse.error;
  if (editProductValidatorError) throw editProductValidatorError;

  // check for price and noInStock in req.body and change user inputs to number
  if (req.body.price) req.body.price = parseFloat(req.body.price);
  if (req.body.noInStock) req.body.noInStock = parseInt(req.body.noInStock);
  // if everything okay, update product
  // const productUpdate = await Product.updateOne({ _id: productId },{ $set: req.body});
  const productUpdate = await Product.findByIdAndUpdate({ _id: productId }, req.body, { new: true });
  res.status(200).json({
    status: "Success",
    message: "product updated successfully",
    productUpdate,
  });
};


const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { error } = validateMongoId(req.params);
  if (error)
    throw new BadUserRequestError(
      "Please pass in a valid mongoId for the product"
    );

  const product = await Product.findById({ _id: productId });
  if (!product) throw new NotFoundError("Error: No such product exists");

  // retrieve image url from database and extract the filename
  const productImageURL = product.image_url;
  const productImage = productImageURL
    .split("s3.us-west-2.amazonaws.com/")
    .pop();

  const data = await deleteFile(productImage);
  if (data) {
    const product = await Product.findByIdAndDelete({ _id: productId });
    res.status(200).json({
      status: "Success",
      message: "Product successfully deleted",
      // product
    });
  } else {
    res.status(500).json({
      status: "Failed",
      message: "Product not deleted",
    });
  }
};

const deleteFile = async (imgUrl) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imgUrl,
  };
  //check if image exists in AWS bucket
  try {
    const findCommand = new HeadObjectCommand(params);
    const fileExists = await s3Client.send(findCommand);
    // if image exists, delete from bucket
    if (fileExists) {
      console.log("file found in S3");
      const deleteCommand = new DeleteObjectCommand(params);
      const response = await s3Client.send(deleteCommand);
      return true;
    }
  } catch (err) {
    if (err.message === "UnknownError") return false;
  }
};

module.exports = {
  uploadImg,
  addProduct,
  getAllProducts,
  getOneProduct,
  getProductsbyCategory,
  getProductsbySearch,
  editProduct,
  editImg,
  deleteProduct,
};
