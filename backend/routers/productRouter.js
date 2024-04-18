// module.exports = router;const express = require('express');
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const { admin } = require("../middleware/roles");

const {
  addProduct,
  uploadImg,
  getAllProducts,
  getOneProduct,
  getProductsbyCategory,
  getProductsbySearch,
  editImg,
  editProduct,
  deleteProduct
} = require("../controllers/productController");


router.route("/add").post([authenticateUser, admin, uploadImg], addProduct);
router.route("/image").post(uploadImg);
router.route("/all").get([authenticateUser, admin], getAllProducts);
router.route("/search/:keyword").get(authenticateUser, getProductsbySearch);
// router.route("/edit/:1d").patch(authenticateUser, editProduct);
router
.route("/:id")
.get(authenticateUser, getOneProduct)
.patch([authenticateUser, admin, editImg], editProduct)
.delete([authenticateUser, admin], deleteProduct);
router.route("/").get(authenticateUser, getProductsbyCategory);


module.exports = router;
