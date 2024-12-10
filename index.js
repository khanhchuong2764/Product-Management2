const express = require('express');
require('dotenv').config()

const path = require('path');

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


app.use(methodOverride('_method'))

// Flash
app.use(cookieParser("sdkdfjshfhshdf"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');


app.locals.PrefixAdmin = SystemConfig.PrefixAdmin;

//Router
Router(app);
RouterAdmin(app);

app.use(express.static(`${__dirname}/public`));

//Connect Database
database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})