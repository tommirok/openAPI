const express = require("express");
const bodyParser = require("body-parser");
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.random");
const db = require("./app/models");
const apiTask = require("./app/routes/task");
const apiUser = require("./app/routes/user");
const models = require("./app/models")

const app = express();
app.use(bodyParser.json());
app.use(express.static("app/public"));
apiUser(app, db);

apiTask(app, db);


app.listen(8080, () => console.log("App listening on port 8080!"));
