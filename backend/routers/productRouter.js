// module.exports = router;const express = require('express');
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth')
const admin = require('../middleware/admin')

const {addProduct} 
       = require('../controllers/productController')

       router.route('/add').post([authenticateUser, admin],addProduct)
       

// router.route('/:page').get(getUsers)
// router.route('/all/:page').get(getAllUsers)
// router.route('/').delete(deleteUser)
// router.route('/').patch(updateUser)


module.exports = router;