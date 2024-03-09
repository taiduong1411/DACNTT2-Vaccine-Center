const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CenterModel = new Schema({
    center_name: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: {
            province: String,
            district: String,
            street: String,
            number: String
        },
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    reportDisease: {
        type: [{
            email: String,
            phone: String,
            desc: String,
            isComplete: String,
        }]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Center", CenterModel);