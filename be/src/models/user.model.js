const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    vac_history: {
        type: [{
            vid: String,
            cid: String,
            dateBooking: String,
            timeBooking: String,
        }]
    },
    currentSchedule: {
        type: [{
            vid: String,
            cid: String,
            dateBooking: String,
            timeBooking: String,
            _id: String
        }]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", UserModel);