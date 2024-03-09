const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const BlogModel = new Schema({
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    sub_content: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    hashtags: {
        type: [String],
    },
    slug: {
        type: String,
        slug: 'title'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Blog", BlogModel);