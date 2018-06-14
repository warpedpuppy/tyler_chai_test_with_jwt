'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

let { Destination } = require('./models');
let { Activity } = require('./activityModel');

const destinationsRouter = express.Router();

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

destinationsRouter.use(bodyParser.urlencoded({ extended: true })); destinationsRouter.use(bodyParser.json());

// Upload image on POST

destinationsRouter.post('/upload/:destTitle', [jsonParser, jwtAuth], function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.file.path;
        // if (!fs.existsSync(dir)){
        //     fs.mkdirSync(dir);
        // }
        var newpath = `./public/img/destinations/${req.user.username}-${req.params.destTitle}-${files.file.name}`;
        if (fs.existsSync(newpath)) {
            res.status(500).send('A file with that name already exists for this destination. Rename the file and try the upload again.');
        } else {
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
            Destination.findOneAndUpdate()
        }
    });

})

// Post to create a destination

destinationsRouter.post('/', [jsonParser, jwtAuth], (req, res) => {
    let { name, complete, published, activities } = req.body;

    name = name.trim();

    let tempArray = [];
    for (let activity of req.body.activities) {
        tempArray.push({
            name: activity.name,
            url: activity.url,
            user: req.user.username,
            destination: activity.destination
        })
    }
    console.log(tempArray);
    Activity.insertMany(tempArray)
        .then(resArray => {
            console.log(resArray);
            let idArray = [];
            for (let res of resArray) {
                idArray.push(res._id);
            }
            console.log(idArray);
            createDestination(idArray);
        })
        .catch(err => {
            console.log(err);
        })

    function createDestination(idArray) {
        Destination.find({ user: req.user.username, name })
            .count()
            .then(count => {
                if (count > 0) {
                    // User has an existing destination with the same name
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
                    activities: idArray,
                });
            })
            .then(destination => {
                res.status(200).send(destination);
            })
            .catch(err => {
                if (err.reason === 'ValidationError') {
                    return res.status(err.code).json(err);
                }
                res.status(500).json({ code: 500, message: 'Internal server error' });
            });
    }
});

// Update a destination by id on PUT

destinationsRouter.put('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    let { name, complete, published, activities } = req.body;

    let tempArray = [];
    for (let activity of req.body.activities) {
        tempArray.push({
            name: activity.name,
            url: activity.url,
            user: req.user.username,
            destination: activity.destination
        })
    }
    console.log(tempArray);
    Activity.insertMany(tempArray)
        .then(resArray => {
            console.log(resArray);
            let idArray = [];
            for (let res of resArray) {
                idArray.push(res._id);
            }
            console.log(idArray);
            updateDestination(idArray);
        })
        .catch(err => {
            console.log(err);
        })

    function updateDestination(idArray) {
        req.body.activities = idArray;
        console.log(req.body);
        // Destination.findOneAndUpdate(req.params.id, { $set: { name: req.body.name, complete: req.body.complete, published: req.body.published, activities: idArray } }, { new: true })
        Destination.findByIdAndUpdate(req.params.id, req.body, { new: true })
            // .populate("activites")
            .then(dest => {
                res.send(dest);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: 'Internal server error' })
            });
    }
});

// Remove a destination by name on DELETE

destinationsRouter.delete('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    Destination.findOneAndRemove({ _id: req.params.id })
        .then(dest => res.send(`${req.params.id} deleted.`))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Get one destination by id on GET

destinationsRouter.get('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    return Destination.findOne({ _id: req.params.id })
        .populate("activities")
        .then(destination => {
            res.json(destination);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all destinations for all users

destinationsRouter.get('/all/', [jsonParser, jwtAuth], (req, res) => {
    return Destination.find()
        .populate("activities")
        .then(destinations => {
            res.json(destinations);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//GET all published destinations

destinationsRouter.get('/public/', jsonParser, (req, res) => {
    return Destination.find({ published: true })
        .populate("activities")
        .then(destinations => {
            // let tempArray = destinations.map(destination => destination.serialize());
            // res.json(tempArray);
            res.json(destinations)
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all destinations for the current user

destinationsRouter.get('/', [jsonParser, jwtAuth], (req, res) => {
    return Destination.find({ user: req.user.username })
        .populate("activities")
        .then(destinations => {
            // let tempArray = destinations.map(destination => destination.serialize());
            // res.json(tempArray);
            res.json(destinations);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { destinationsRouter };
