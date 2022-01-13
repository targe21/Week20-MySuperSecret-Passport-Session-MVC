require('dotenv').config();
const express = require('express');
const mainRouter = require('./routes/mainRoute');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

//initialize session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/mySecretDB', {useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userSecret: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(mainRouter);

const port = 5000;

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}.`);
});