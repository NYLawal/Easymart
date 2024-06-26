const Joi = require("joi");
const { ValidationError } = require("../middleware/errors");
const joiPhoneValidate = Joi.extend(require('joi-phone-number'));

function userSignUpValidator(user) {
    const schema = Joi.object({
      fullName: Joi.string()
        .min(7)
        .max(50)
        .required()
        .error(
            new ValidationError(
              "fullname cannot be empty and must be between 7 and 50 characters"
            )
          ),
      email: Joi.string()
        .required()
        .email()
        .error(
          new ValidationError(
            "please input a valid email"
          )
        ),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
        .messages({ "string.pattern.base": "invalid password" })
        .error(
          new ValidationError(
            "password must be between 8 and 25 characters with at least one number, a lowercase letter, an uppercase letter"
          )
        ),
      phoneNumber: joiPhoneValidate.string()
      .phoneNumber({ format: "international",
      strict: true, })
      .error(
        new ValidationError(
          "please input a valid phone number with valid country code"
        )
      )
      
    }).strict();
  
    return schema.validate(user);
  }


  function userLogInValidator(user) {
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email()
        .error(
          new ValidationError(
            "Please input a valid email"
          )
        ),
        password: Joi.string()
        .required()
        .min(8)
        .max(25)
        .error(
          new ValidationError(
            "Input a valid password"
          )
        )
    }).strict();
  
    return schema.validate(user);
}

function forgotPasswordValidator(user){
const schema = Joi.object({
  email:Joi.string()
  .required()
  .email()
  .error(
    new ValidationError(
      "Input a valid email"
    )
  ),
}).strict()

return schema.validate(user);
}

function resetPasswordValidator(user) {
  const schema = Joi.object({
  // email:Joi.string()
  // .required()
  // .email()
  // .error(
  //   new ValidationError(
  //     "please input a valid email"
  //   )
  // ),
  password: Joi.string()
  .required()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/)
  .messages({ "string.pattern.base": "invalid password" })
  .error(
    new ValidationError(
      "password must be between 8 and 25 characters with at least one number, a lowercase letter, an uppercase letter"
    )
  )
}).strict()

return schema.validate(user);
}

function addAdminValidator(user){
  const schema = Joi.object({
    email:Joi.string()
    .required()
    .email()
    .error(
      new ValidationError(
        "Input a valid email"
      )
    ),
  }).strict()
  
  return schema.validate(user);
  }


  module.exports = {userSignUpValidator, userLogInValidator, forgotPasswordValidator, resetPasswordValidator, addAdminValidator};