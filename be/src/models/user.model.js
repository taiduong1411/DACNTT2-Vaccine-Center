const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    vac_history: {
        type: {
            vid: String,
            date: String,
            did: String,
            cid: String,
            status: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", UserModel);