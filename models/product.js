const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment')

let date = moment().zone("+05:00").format('HH:mm  DD.MM.YYYY')
let numberCheque = (Math.random()*1000000).toString().slice(0, 6);
const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    date: { type: String, default: date},
    cheque: {type: String, default: numberCheque}
});

const Product = mongoose.model('Product', productSchema);
function validateProduct(product) {
    const productSchema = Joi.object({
        title: Joi.string().min(3).max(30).required(),
        price: Joi.number().min(0).max(1000000).required()
    });
    
    return productSchema.validate(product);
}


exports.Product = Product;
exports.validate = validateProduct;
