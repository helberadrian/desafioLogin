const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const parseArgs = require('minimist');

// Ini
const app = express();
require('./database');
require('./passport/auth');
require('./keys');

// minimist
const options = {
    alias: {
        p: 'puerto'
    },
    default: {
        puerto: 8080
    }
}

const command = process.argv.slice(2);
const { puerto } = parseArgs(command, options);

// settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// routes
app.use('/', require('./routes/index'));

// starting server
app.listen(puerto, process.env.HOST, () => {
    console.log(`Servidor conectado escuchando en http://${process.env.HOST}:${puerto}`);
});