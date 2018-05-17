'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const { Destination } = require('./destModel');

const destRouter = express.Router();

const jsonParser = bodyParser.json();

destRouter.post('/', jsonParser, (req, res) => {
    console.log("Destinations endpoint hit!");
    let { name, complete, activities } = req.body;

    return Destination.create({
        name,
        complete,
        activities
    });
});

destRouter.get('/', (req, res) => {
    return Destination.find()
        .then(destinations => res.json(destinations.map))
        .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

module.exports = { destRouter };