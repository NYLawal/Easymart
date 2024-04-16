// module.exports = router;const express = require('express');
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth')
const {admin} = require('../middleware/roles')

const {addProduct, uploadImg, getAllProducts, getOneProduct, getProductsbyCategory,deleteProduct } 
       = require('../controllers/productController')

       router.route('/add').post([authenticateUser, admin, uploadImg], addProduct)
       router.route('/image').post(uploadImg)
       router.route('/all').get([authenticateUser, admin], getAllProducts)
       router.route('/:id').get(authenticateUser,  getOneProduct).delete([authenticateUser, admin], deleteProduct)
       router.route('/').get(authenticateUser, getProductsbyCategory)
       
       

// router.route('/:page').get(getUsers)
// router.route('/all/:page').get(getAllUsers)
// router.route('/').delete(deleteUser)
// router.route('/').patch(updateUser)


module.exports = router;