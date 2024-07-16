const mongoose = require('mongoose')

const phonebookSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Contact = mongoose.model('contacts', phonebookSchema)

module.exports = Contact