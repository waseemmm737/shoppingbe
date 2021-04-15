var express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appRoute = express.Router();
const Product = require('./Products/product');
var app = express();
app.use(cors());
app.use(bodyParser.json());
appRoute.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
mongoose.connect(process.env.mongooseURI,
    { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

app.route('/').get(function (req, res) {
    res.json('Express server working');
});

app.route('/addProduct').post(function (req, res) {
    let reqs = req.body;
    let product = new Product(reqs);
    product.save()
        .then(product => {
            res.status(200).json(product);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.route('/getProducts').get(function (req, res) {
    Product.find({}, function (err, products) {
        if (!err)
            res.status(200).json(products);
        else
            res.status(400).json(err);
    });
});

app.route('/updateProduct/:product_id').post(function (req, res) {
    Product.findOneAndUpdate({ _id: req.params.product_id }, { $set: req.body })
        .then(_ => res.status(200).json("Update sucessfull"))
        .catch(err => res.status(400).send(err))
});

app.route('/deleteProduct/:product_id').delete(function (req, res) {
    Product.remove({ _id: req.params.product_id })
        .then(_ => res.status(200).json("Delete sucessfull"))
        .catch(err => res.status(400).send(err))
});

app.listen(process.env.PORT || 5000)
exports = module.exports = app;