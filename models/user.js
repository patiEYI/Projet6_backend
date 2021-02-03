const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(4)
.is().max(18)
.has().lowercase()
.has().uppercase()
.has().not().spaces();

// Validation email
let validEmail = (email) => {
  if (!email) {
    return false; 
  } else {
    // Regex
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email); 
  }
};

// Validate password
let validPassword = (password) => {
  if (password) {
    // Regex
    const regExp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
    return regExp.test(password);

    // Start anchor
    // (?=.*[A-Z])               Ensure string has one uppercase letters.
    // (?=.*[!@#$&*])            Ensure string has one special case letter.
    // (?=.*[0-9])               Ensure string has one digits.
    // (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    // .{8}                      Ensure string is of length 8.
    // $                         End anchor.
    
  } else {
 
    return false; 
  }
};
// /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,18}$/
const userSchema = mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    validate: validEmail,
    lowercase: true,  
  },
  password: { 
    type: String,
    required: true,
    validate: validPassword
  }
});
userSchema.plugin(uniqueValidator);



module.exports = mongoose.model('User', userSchema)