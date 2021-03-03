const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//regex 
//mot de passe
//un maj, un chiffre, un caractère spécial, min:8, max:15
const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//methode masquage email
const maskData = require("maskdata");
const emailMaskOptions = { 
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 2,
  unmaskedEndCharactersAfterAt: 1,
  maskAtTheRate: false,
};

//création d'un nouveau utilisateur
exports.signup = (req, res, next) => { 
  if  ( !regexPassword.test(req.body.password) && !regexEmail.test(req.body.email) ) {
    return res.status(400).json({ error: 'Format email ou mot de passe invalid'});
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const user = new User({
        email: maskData.maskEmail2(req.body.email, emailMaskOptions),
        password: hash
    });
  
    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//connexion  user
exports.login = (req, res, next) => { 
  User.findOne({ email: maskData.maskEmail2(req.body.email, emailMaskOptions)})
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {
      if (!valid) {
        return res.status(401).json({ error: 'Mot de passe incorrect !' });
      }
      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '72h' }
        )
      });
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};



  