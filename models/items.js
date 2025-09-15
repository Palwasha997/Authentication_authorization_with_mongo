const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    price: Number
});

const item = mongoose.model('Item', itemSchema);

module.exports = item;