const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
//regex mot de passe
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;

exports.signup = (req, res, next) => {
  if  ( !regex.test(req.body.password)) {
    return res.status(400).json({ error: 'Certains caractères ne sont pas autorisés'});
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const user = new User({
        email: req.body.email ,
        password: hash
    });
   // MaskData.maskEmail2( req.body.email ,  emailMask2Options ) ;
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
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



  