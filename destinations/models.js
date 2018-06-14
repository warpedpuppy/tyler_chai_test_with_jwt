'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const destinationSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 1
    },
    complete: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    }]
});

// DestinationSchema.methods.serialize = function () {
//     return {
//         user: this.user,
//         name: this.name,
//         complete: this.complete || false,
//         published: this.published,
//         activities: this.activities,
//         id: this.id
//     };
// };

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = { Destination };
