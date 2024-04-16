const multer = require("multer"); // multer will be used to handle the form data.
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const _ = require("lodash");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { BadUserRequestError, NotFoundError } = require("../middleware/errors");
const productInfo = require("../files/productInfo.json");

const { addProductValidator } = require("../validators/productValidator");
const { validateMongoId } = require("../validators/mongoIdValidator");

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
  })

  res.status(200).json({
    status: "Success",
    msg: "product created successfully",
    newProduct
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
      msg: `${products.length} products found`,
      products,
    });
  }
};

const getOneProduct = async (req, res, next) => {
  const productId = req.params.id;

  const { error } = validateMongoId(req.params)
  if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the product")

  const product = await Product.findById({ _id: productId }).select("-images -createdAt -updatedAt -__v");;
  if (!product) throw new NotFoundError("Error: No such product found");
  res.status(200).json({
    status: "Success",
    msg: "Product found",
    product
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
    msg: `${products.length} products found`,
    products
  });
};


const deleteProduct = async(req,res,next) =>{
  const productId = req.params.id
  const { error } = validateMongoId(req.params)
  if( error ) throw new BadUserRequestError("Please pass in a valid mongoId for the product")

  const product = await Product.findById({_id:productId})
  if (!product) throw new NotFoundError("Error: No such product exists")
 
  const productImageURL = product.image_url
  const productImage = productImageURL.split("s3.us-west-2.amazonaws.com/").pop()

  const data = deleteFile(productImage)

  if (data){
  const product = await Product.findByIdAndDelete({_id:productId})
  res.status(200).json({
    status: "Success",
    msg: "Product successfully deleted",
    // product
  });
}
else{
  res.status(500).json({
    status: "Failure",
    msg: "Product not deleted",
    // product
  });
}
}


const deleteFile = async(imgUrl) => {
 const data =  await s3.deleteObject(
      {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imgUrl
      },
      async (err, data) => {
        if (err) {
            console.log("Error: Object delete failed.");
        }
        else {
            console.log("Success: Object delete successful.");
            console.log(data);
        }
    });
      return data
}

module.exports = {
  uploadImg,
  addProduct,
  getAllProducts,
  getOneProduct,
  getProductsbyCategory,
  deleteProduct
};



// s3.deleteObjects(
//   {
//     Bucket: 'uploads-images',
//     Delete: {
//       Objects: [{ Key: 'product-images/slider-image.jpg' }],
//       Quiet: false,
//     },
//   },
//   function (err, data) {
//     if (err) console.log('err ==>', err);
//     console.log('delete successfully', data);
//     return res.status(200).json(data);
//   }
// );

// async deleteFile(Location) {
//   const params = {
//       Bucket: AWS_S3_BUCKET,
//       Key: Location.split("s3.amazonaws.com/").pop()
//   };

//   const data = await this.s3.deleteObject(params).promise();

//   return data;
// }
