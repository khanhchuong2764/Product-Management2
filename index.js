const express = require('express');
require('dotenv').config()

const Router = require("./routes/client/index.route");
const RouterAdmin = require("./routes/admin/index.route");

const database = require("./config/database");
const app = express();
const port = process.env.Port;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"));

//Connect Database
database.connect();
//Router
Router(app);
RouterAdmin(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})