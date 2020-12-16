const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const Routes = express.Router();
const PORT = 5000;
var Validator = require("jsonschema").Validator;
var v = new Validator();
app.use(cors());
app.use(bodyParser.json());

Routes.route("/addProduct").post(function (req, res) {
  let reqs = req.body;
  let ress = v.validate(
    reqs,
    {
      $schema: "http://json-schema.org/draft-04/schema#",
      id: "number",
      name: "string",
      desc: "string",
      price: "number",
      pic: "string",
      required: ["name", "price"],
    },
    { required: true }
  );
  if (!ress.valid) {
    console.log("invalid data")
    res.status(400).json("Invalid Product");
  } else {
    console.log("Add new Product...", req.body);
    fs.readFile(
      "Products/products.json",
      "utf8",
      function readFileCallback(err, data) {
        if (err) {
          res.status(400).json(err.message);
        } else {
          obj = JSON.parse(data); //now it an object
          obj.products.push(reqs); //add some data
          json = JSON.stringify(obj); //convert it back to json
          fs.writeFile("Products/products.json", json, "utf8", () =>
            res.status(200).json("Product added successfully")
          ); // write it back
        }
      }
    );
  }
});

Routes.route("/getProducts").get(function (req, res) {
  fs.readFile(
    "Products/products.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(400).send(err);
      } else {
        obj = JSON.parse(data); //now it an object
        res.json(obj.products);
      }
    }
  );
});

app.use("/prohub", Routes);

app.listen(PORT, () => {
  console.log("server is running at Port " + PORT);
});
