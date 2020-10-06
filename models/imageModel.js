var mongoose = require("mongoose");

var imageModel = mongoose.Schema({
    src: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    thumbnailWidth: {
        type: Number,
        required: true
    },
    thumbnailHeight: {
        type: Number,
        required: true
    },
    isSelected: {
        type: Boolean,

        default: false
    },
    caption: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:String
    }

});

module.exports = mongoose.model("image", imageModel, "image");