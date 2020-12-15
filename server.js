const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const Routes = express.Router();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

Routes.route("/addProduct").post(function (req, res) {
  console.log("Add new Product...", req.body);
  let reqs = req.body;
  fs.readFile(
    "Products/products.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(400).send(err.message)
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
