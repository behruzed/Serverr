const {
    model,
    Schema
} = require('mongoose')

module.exports = model("turnir", new Schema({
    gameName: String,
    date: Number,
    author: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["active", "nonactive", "progressing"],
        default: "progressing"
    },
    code: Number,
    info: {
        type: String
    }
}, { timestamps: true }))