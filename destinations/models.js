'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DestinationSchema = mongoose.Schema({
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

DestinationSchema.methods.serialize = function () {
    return {
        name: this.name,
        complete: this.complete || false,
        activities: this.activities
    };
};

const Destination = mongoose.model('Destination', DestinationSchema);

console.log(`This is destinations/models ${typeof Destination} - ${Destination}`)

module.exports = { Destination };
