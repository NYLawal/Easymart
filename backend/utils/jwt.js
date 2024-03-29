const jwt = require('jsonwebtoken');

module.exports = function generateToken(user){
const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    isAdmin: user.isAdmin
  }
const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: 60 * 60 * 24 });
return token 
}

// userSchema.methods.generateToken = function(){
//     const payload = {
//       _id: this._id,
//       email: this.email,
//       fullName: this.fullName,
//       isAdmin: this.isAdmin
//     }
//     const token = jwt.sign(payload, process.env.jwt_secret_key, { expiresIn: 60 * 60 * 24 });
//     return token 
//   }