const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//databse connect
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log(`mongodb connected`))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);

app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));

//express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//connect flash
app.use(flash());

//Router
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
