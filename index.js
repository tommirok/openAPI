const express = require("express");
const bodyParser = require("body-parser");
const faker = require("faker");
const db = require("./app/models");
const apiTask = require("./app/routes/task");
const apiUser = require("./app/routes/user");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path")
const app = express();
const swaggerjson = require("./swagger.js")
const options = {
  swaggerOptions: {},
  swaggerDefinition: swaggerjson,
  // List of files to be processes.
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ["./app/routes/*.js"]
  }
app.use(bodyParser.json());
app.use(express.static("app/public"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});

apiUser(app, db);
apiTask(app, db);
app.listen(8080, () => console.log("App listening on port 8080!"));
