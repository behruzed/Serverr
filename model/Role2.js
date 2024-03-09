const {
    model,
    Schema
} = require('mongoose')

module.exports = model("turnir", new Schema({
    gameName: String,
    date: String,
    author: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["active", "nonactive", "progressing"],
        default: "progressing"
    },
    code: String,
    university: String,
    info: {
        type: String
    }
}, { timestamps: true }))