const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorModel = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    centerOf: {
        type: String,
        required: true
    },
    vac_schedule: {
        type: {
            uid: String,
            vid: String,
            cid: String,
            date: String,
        }
    },
    assignDisease: {
        type: [{
            desc: String,
            note: String,
            status: Boolean,
            diseaseId: String
        }]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Doctor", DoctorModel);