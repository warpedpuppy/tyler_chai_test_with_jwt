'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DestinationSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    activities: []
});

DestinationSchema.methods.serialize = function () {
    return {
        user: this.user,
        name: this.name,
        complete: this.complete || false,
        published: this.published,
        activities: this.activities
    };
};

const Destination = mongoose.model('Destination', DestinationSchema);

module.exports = { Destination };
