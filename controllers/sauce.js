const Sauce = require('../models/sauce');
const fs = require('fs');


const regex = /^[^$'=+@()&{}"#\-_)](.|\n|\r|\n\r){3,50}$/;

//récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
    
};

//création d'une sauce
exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauceObject = JSON.parse(req.body.sauce);
    
    //regex
    if  ( !regex.test(sauceObject.name) || 
    !regex.test(sauceObject.manufactured) || 
    !regex.test(sauceObject.description) ||
     !regex.test(sauceObject.mainPepper)) {  
         
        return res.status(400).json({ error: 'Certains caractères ne sont pas autorisés'});
    }  
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked: [],
        
    });
    sauce.save()  
    .then(() => res.status(201).json({ message: 'Votre sauce a bien été enrégistré'}))
    .catch(error => res.status(400).json({ error }));
     
};

//Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
    
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié'}))
    .catch(error => res.status(400).json({ error }));
  
}

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error }));
};

//Like ou dislike une sauce
exports.likeSauce = (req, res, next) => {
    const sauceObject = req.body ;
    let like = req.body.like; // 0, 1, -1
    const userId = req.body.userId;
 
    const P = new Promise(
        function (resolve, reject) {

            if (like == 0) { //if like = 0
              Sauce.findOne({ _id: req.params.id})
                .then((sauce) => { 
                    if((sauce.usersLiked.includes(userId))) {  // if user in usersliked remove userId
                        Sauce.findOneAndUpdate({ _id: req.params.id}, {$pull:{usersLiked: userId}, $inc: {likes: -1}})
                        .then(() => resolve(sauceObject))
                        .catch((err) => reject(err)); 
                
                    }else if((!sauce.usersLiked.includes(userId))){ // if user in usersdisliked remove userI
                        Sauce.findOneAndUpdate({ _id: req.params.id}, {$pull:{usersDisliked: userId}, $inc: {dislikes: -1}})
                        .then(() => resolve(sauceObject))
                        .catch((err) => reject(err))          
                    } 
                })
                .then(() => resolve(sauceObject))
                .catch((error) => res.status(400).json({error}))    
                         
            } else if (like == -1) {//if like = -1
                Sauce.findOneAndUpdate({ _id: req.params.id }, {$addToSet:{ usersDisliked: userId }, $inc: {dislikes : 1 }})
                .then((result) => resolve(userId))
                .catch((err) => reject(err));  

            } else if  (like == 1) {  // if like = 1 
               
                Sauce.findOneAndUpdate({ _id: req.params.id }, 
                    {$addToSet:{ usersLiked: userId },$inc: {likes : 1 }})
                .then((result) => resolve(userId))
                .catch((err) => reject(err));
            }    
        } 
       
    )
    P.then(() => res.status(200).json(sauceObject))
    .catch((error) => res.status(400).json({ error }));          
}





