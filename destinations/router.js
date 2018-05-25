'use strict'
const express = require('express');
const bodyParser = require('body-parser');

let { Destination } = require('./models');

const destinationsRouter = express.Router();

const jsonParser = bodyParser.json();

// Post to create a destination
destinationsRouter.post('/', jsonParser, (req, res) => {
    let { name, complete, published, activities } = req.body;

    name = name.trim();

    return Destination.find({ name })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing destination with the same name
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Destination already exists',
                    location: 'name'
                });
            }
            return Destination;
        })
        .then(destination => {
            return Destination.create({
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

destinationsRouter.put('/:name', jsonParser, (req, res) => {
    let { complete, published, activities } = req.body;
    // return destination.activities.forEach(
    //     activity => {
    //         if (req.body.name)
    //     }
    // )
    let destination = req.body;
    destination.activities.forEach(activity => {
    })
    Destination.findOneAndUpdate({name: req.params.name}, {$push: {activities: req.body.activities}}, {new: true})
    .then(dest => {
        // let tempArray = dest.activities.slice();
        // if (req.body.activity) {
        //     tempArray.push(req.body.activity);
        //     let tempObj = 
        //     Destination.findByIdAndUpdate(req.body._id);
        // }
        res.send(dest);
    })
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

// Remove a destination by name on DELETE

destinationsRouter.delete('/:name', (req, res) => {
    Destination.findOneAndRemove({name: req.params.name})
    .then(dest => res.send(`${req.params.name} deleted.`))
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

// Get one destination by name on GET

destinationsRouter.get('/:name', (req, res) => {
    return Destination.findOne({name: req.params.name})
        // .then(destination => res.json(destination.map(desinationSerialized => destination.serialize())))
        .then(destination => res.json(destination))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Get all destinations on GET

destinationsRouter.get('/', (req, res) => {
    return Destination.find()
        // .then(destinations => res.json(destinations.map(desination => destination.serialize())))
        .then(destinations => res.json(destinations))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { destinationsRouter };
