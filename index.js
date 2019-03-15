const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
  port = process.env.PORT || 3000;


// connection configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
console.log('API server started on: ' + port);
