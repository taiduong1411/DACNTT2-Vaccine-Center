const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const VaccineModel = new Schema({
    pro_name: {
        type: String,
        required: true
    },
    pro_code: {
        type: String,
        // unique: true,
        required: true
    },
    img: {
        type: [Array]
    },
    cover: {
        type: String
    },
    desc: {
        type: String
    },
    centerOf: {
        type: [{
            cid: String,
            // center_name: String,
            amount: String
        }],
        required: true
    },
    details: {
        generalInformation: String,
        vaccineForPerson: String,
        vaccineSchedule: String,
        vaccineCondition: String,
        vaccineDistance: String,
        vaccineReact: String,
        vaccineStatus: String,
        vaccineFaq: String
    },
    slug: {
        type: String,
        slug: 'pro_name'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Vaccine", VaccineModel);