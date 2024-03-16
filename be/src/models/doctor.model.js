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
    certificates: {
        type: [String]
    },
    // vac_schedule: {
    //     type: {
    //         uid: String,
    //         vid: String,
    //         cid: String,
    //         date: String,
    //         _id: String
    //     }
    // },
    assignDisease: {
        type: [{
            desc: String,
            note: String,
            status: String,
            diseaseId: String
        }]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Doctor", DoctorModel);