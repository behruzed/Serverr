const {
    model,
    Schema
} = require('mongoose')

module.exports = model("ucer", new Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["superadmin", "admin", "talaba"],
        default: "talaba"
    },
    university: {
        type: String,
        require: true
    },
    info: {
        type: String
    }
}, { timestamps: true }))