const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config= require('../config/default.json')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength:8,
      maxlength: 50,
      // unique:true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    //   index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
      maxlength: 1024
    },
    userRole: {
      type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
      type: String,
    },
    userImage: {
      type: String,
      default: "user.png",
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function(){
  const payload = {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    isAdmin: this.isAdmin
  }
  const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: 60 * 60 * 24 });
  return token 
}

const User = mongoose.model("User", userSchema);
module.exports = User;