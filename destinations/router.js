'use strict'
const express = require('express');
const bodyParser = require('body-parser');

let { Destination } = require('./models');

const destinationsRouter = express.Router();

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

destinationsRouter.use(bodyParser.urlencoded({ extended: true })); destinationsRouter.use(bodyParser.json());

// Post to create a destination

destinationsRouter.post('/', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.body);
    let { name, complete, published, activities } = req.body;

    name = name.trim();


    return Destination.find({ user: req.user.username, name })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing destination with the same name
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: `You already have a destination named ${name}`,
                    location: 'name'
                });
            }
            return Destination;
        })
        .then(destination => {
            return Destination.create({
                user: req.user.username,
                name,
                complete,
                published,
                activities
            });
        })
        .then(destination => {
            return res.status(201).json(destination.serialize());
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
});

// Update a destination by name on PUT
// Adds activities to an existing destination

destinationsRouter.put('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    let { complete, published, activities } = req.body;
    console.log(req.body);
    // return destination.activities.forEach(
    //     activity => {
    //         if (req.body.name)
    //     }
    // )

    // let destination = req.body;d
    // destination.activities.forEach(activity => {
    // })

    // Friend.findOneAndUpdate({_id: req.body.id}, {$set:{email: req.body.email}, $push: { previousEmails: this.email } }
    // }, {new: true}, function(err, friend){
    //     if (err){
    //         console.log(err); 
    //     } 
    // });
    Destination.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name, complete: req.body.published, published: req.body.published, activities: req.body.activities } }, { new: true })
        .then(dest => {
            // let tempArray = dest.activities.slice();
            // if (req.body.activity) {
            //     tempArray.push(req.body.activity);
            //     let tempObj = 
            //     Destination.findByIdAndUpdate(req.body._id);
            // }
            res.send(dest);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Remove a destination by name on DELETE

destinationsRouter.delete('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    Destination.findOneAndRemove({ _id: req.params.id })
        .then(dest => res.send(`${req.params.id} deleted.`))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Get one destination by name on GET

// destinationsRouter.get('/:id', [jsonParser, jwtAuth], (req, res) => {
//     return Destination.findOne({ _id: req.params.id })
//         // .then(destination => res.json(destination.map(desinationSerialized => destination.serialize())))
//         .then(destination => res.json(destination))
//         .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });

// GET all desetinations for all users

destinationsRouter.get('/all/', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.user)
    return Destination.find()
        .then(destinations => {
            res.json(destinations);
        })
        // .then(destinations => res.json(destinations))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//GET all published destinations

destinationsRouter.get('/public/', jsonParser, (req, res) => {
    return Destination.find({ published: true })
        // .then(destinations => res.json(destinations.map(desination => destination.serialize())))
        .then(destinations => {
            let tempArray = destinations.map(destination => destination.serialize());
            res.json(tempArray);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all destinations for the current user

destinationsRouter.get('/', [jsonParser, jwtAuth], (req, res) => {
    console.log(req.user)
    return Destination.find({ user: req.user.username })
        .then(destinations => {
            let tempArray = destinations.map(destination => destination.serialize());
            res.json(tempArray);
        })
        // .then(destinations => res.json(destinations))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { destinationsRouter };
