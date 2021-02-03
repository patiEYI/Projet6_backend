const Sauce = require('../models/sauce');
const fs = require('fs');
const User = require('../models/user');
// const sauce = require('../models/sauce');
// const user = require('../models/user');
const jwt = require('jsonwebtoken');



// const regex = /^(.|\n|\r|\n\r){3,}$/; 


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
    
};


exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauceObject = JSON.parse(req.body.sauce);
    
    //regex
    // if  (!regex.test(sauceObject.name)       ||
    //     !regex.test(sauceObject.manufactured)||
    //     !regex.test(sauceObject.description) ||
    //     !regex.test(sauceObject.mainPepper)  ||
    //     !regex.test(sauceObject.heat)) {  
         
    //     return res.status(500).json({ error: 'Certains caractères ne sont pas autorisés'});
    // }//else{   
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
   // }  
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
    
};


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




exports.likeSauce = (req, res, next) => {

    const userId = User.findOne({ userId: user._id});
    let like = req.body.likes; // 0 | 1
    let dislike = req.body.dislikes;              
    let usersLiked = req.body.usersLiked;
    let usersDisliked = req.body.usersDisliked

    let Sauce = Sauce.findOne({ id: req.body.id })
       
        .then(() => {
            if (like === 1) {
                like++;
                Sauce.findOneAndUpdate(
                    { _id: req.body.id},
                    { $push:{  usersLiked: userId}}
                ).exec()
                .then(() => res.status(201).json({ message: 'Like !'}))
                .catch(error => res.status(400).json({ error:'pas de like' }));

            } else if ( like === -1) {
                dislike++;
                Sauce.findOneAndUpdate(
                    { _id: req.body.id},
                    { $push:{  usersDisliked: userId}}
                ).exec()
                // Sauce.usersDisliked.push(userId)
                // Sauce.save()
                .then(() => res.status(201).json({ message: 'disLike !'}))
                .catch(error => res.status(400).json({ error: 'pas de dislike' }));
        
        }else if ( like === 0) {
               //if user in usersliked remove user
            if ( Sauce.usersLiked.includes(userId)) {
                let arrayIndex = Sauce.usersLiked.indexOf(userId);
                Sauce.usersLiked.split(arrayIndex)[1];
                Sauce.likes--;
                Sauce.save()
                .then(() => res.status(201).json({ message: 'Like annuler !'}))
                .catch(error => res.status(400).json({ error: 'pas de like annulé' }));
            }
           
            //if user in usersdisliked remove user
            if ( Sauce.usersDisliked.includes(userId)) {
                let arrayIndex = Sauce.usersDisliked.indexOf(userId);
                Sauce.usersDisliked.split(arrayIndex)[1];
                Sauce.dislikes--;
                Sauce.save()
                .then(() => res.status(201).json({ message: 'dislike annuler !'}))
                .catch(error => res.status(400).json({ error:'pas dislike annuler' }));

            }
            
                
        }
    

    })
    
    .catch(error => res.status(400).json({ error:'error total' }));
       
          
}

       
   
    
    




