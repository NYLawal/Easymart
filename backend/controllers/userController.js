// const bcrypt = require('bcryptjs');
const  { MailNotSentError, BadUserRequestError, NotFoundError } = 
require('../middleware/errors')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const User = require("../models/userModel");
const {
    userSignUpValidator,
    userLogInValidator
} = require("../validators/UserValidator");
// const generateToken = require('../utils/jwt')


const userSignUp = async (req, res, next) => {
    const { error } = userSignUpValidator(req.body);
   
    if (error) { 
        console.log(error.stack)
        throw error
    }
    
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) throw new BadUserRequestError("Error: an account with this email already exists");

    const user = req.body
    const salt= await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    const newUser = await User.create(user);
    const token = newUser.generateToken()
    res.header('x-auth-token', token).status(200).json({
        message: "User created successfully",
        status: "Success",
        user:  _.pick(newUser, ['fullName','email', 'phoneNumber', 'isAdmin' ])
    });
    
}


const userLogIn = async (req, res, next) => {
    const { error } = userLogInValidator(req.body);
    if (error) throw error
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new BadUserRequestError("Error: invalid email or password");
    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) throw new BadUserRequestError("Error: invalid email or password");
    const access_token = user.generateToken()
    res.header('x-auth-token', access_token).status(200).json({
        message: "Successfully logged in",
        status: "Success",
        data: {
          user: _.pick(user, ['_id', 'fullName','email','phoneNumber'])
        }
      });

    
    
}


module.exports = {userSignUp, userLogIn}