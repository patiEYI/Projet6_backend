
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Validation email
let validEmail = (email) => {
  if (!email) {
    return false; 
  } else {
    // Regex
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email); 
  }
};


const userSchema = mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate:  validEmail
      
  },
  password: { 
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    
  }
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema)