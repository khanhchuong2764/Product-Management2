const express = require('express');
require('dotenv').config()

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const flash = require('express-flash');

const session = require('express-session');

const methodOverride = require('method-override');

const Router = require("./routes/client/index.route");
const RouterAdmin = require("./routes/admin/index.route");

const SystemConfig = require("./config/system");

const database = require("./config/database");
const app = express();
const port = process.env.Port;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.set('views', `${__dirname}./views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}`));

// Flash
app.use(cookieParser(process.env.cokkieparser));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

app.locals.PrefixAdmin = SystemConfig.PrefixAdmin;
//Connect Database
database.connect();
//Router
Router(app);
RouterAdmin(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})