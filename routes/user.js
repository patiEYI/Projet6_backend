const express = require('express');
const router = express.Router();
const  rateLimit  =  require ( "express-rate-limit" ) ;

//limiteur de connection
const  limiteur  =  rateLimit ( { 
    windowMs : 15 * 60 * 1000 ,  // 15 minutes 
    max : 5,// limite chaque IP à 100 requêtes par windowMs 
    message :
    "Trop de tentative de connexion veuillez réessayer après 15min" 
  }) ; 

const userCtrl = require('../controllers/user');

//les routes pour les utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', limiteur, userCtrl.login);

module.exports = router;