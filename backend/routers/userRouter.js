const express = require('express');
const router = express.Router();
const {userSignUp,userLogIn} 
       = require('../controllers/userController')


router.route('/signup').post(userSignUp)
router.route('/login').post(userLogIn)
// router.route('/:page').get(getUsers)
// router.route('/all/:page').get(getAllUsers)
// router.route('/').delete(deleteUser)
// router.route('/').patch(updateUser)


module.exports = router;