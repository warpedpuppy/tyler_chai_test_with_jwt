'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const activitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
        },
    user: {
        type: String,
        required: true
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination'
}
});

// ActivitySchema.methods.serialize = function () {
//     return {
//         name: this.name,
//         url: this.url,
//         // || dummyurl,
//         destination: this.destination
//     };
// };

const Activity = mongoose.model('Activity', activitySchema);

module.exports = { Activity };
