const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const BookingModel = new Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    dateBooking: {
        type: String,
        required: true
    },
    timeBooking: {
        type: String,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    vid: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    isCancel: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Booking', BookingModel)