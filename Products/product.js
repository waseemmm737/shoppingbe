const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let product = new Schema({
    name: { type: String, require: true },
    desc: { type: String, require: false },
    price: { type: Number, require: true },
    pic: { type: String, require: false }
}, { collection: 'product' });

module.exports = mongoose.model('Product', product);