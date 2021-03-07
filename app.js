const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

//connection à la base de donnée mongoDB
mongoose.connect('mongodb+srv://Admin:pass@cluster0.vzvya.mongodb.net/<dbname>?retryWrites=true&w=majority',
  {useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussi !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

//Eviter les erreurs cors 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// traitement d'image 
app.use('/images', express.static(path.join(__dirname, 'images')));

// appel route
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;


 





