'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DestSchema = mongoose.Schema({
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

const Destination = mongoose.model('Destination', DestSchema);

console.log(`This is destinations/models ${typeof Destination} - ${Destination}`)

module.exports = { Destination };
