const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
  port = process.env.PORT || 3000;


const mysql = require('mysql');
// connection configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route

const mc = mysql.createConnection({
    host: 'localhost',
    user: 'newuser',
    password: 'password',
    database: 'mydb',
    debug: true,
    port: '/tmp/mysql.sock'
 });
 
// connect to database
mc.connect((err) => {
if(err) {
  throw err;
} else {
  console.log("connected")
}
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
console.log('API server started on: ' + port);
