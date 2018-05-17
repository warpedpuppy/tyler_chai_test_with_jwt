'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const destSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    activities: {
        activity: {
            name: {
                type: String
            },
            imgURL: {
                type: String
            }
        }
    }
});

const Destination = mongoose.model('Destination', destSchema);

module.exports = { Destination };