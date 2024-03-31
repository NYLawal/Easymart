const express = require('express');
const router = express.Router();
const {userSignUp,userLogIn,forgotPassword,resetPassword} 
       = require('../controllers/userController')


router.route('/signup').post(userSignUp)
router.route('/login').post(userLogIn)
router.post('/forgotPassword', forgotPassword)
router.post('/password-reset/:userId/:token', resetPassword)
// router.route('/:page').get(getUsers)
// router.route('/all/:page').get(getAllUsers)
// router.route('/').delete(deleteUser)
// router.route('/').patch(updateUser)


module.exports = router;