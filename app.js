const dotEnv = require('dotenv');
dotEnv.config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/main');

let app = express();

// set cors according in dev env
if (process.env.NODE_ENV === 'development') {
    let whitelist = [
        'http://localhost:3000',
        'http://localhost:4040'
    ];
    let corsOptions = {
        origin: whitelist,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    let cors = require('cors');
    app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


// setup routers
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
