require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { render } = require('ejs');

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

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register({username: req.body.username}, req.body.password, (error, user) =>{
        if(error){
            console.log(error);
            res.redirect('/register')
        } else {
            passport.authenticate('local')(req, res, ()=> {
                //res.send('You have discovered my secret!');
                res.render('secrets');
            });
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (error) => {
        if(error){
            console.log(error);
            res.redirect('/login');
        } else {
            passport.authenticate('local')(req, res, ()=> {
                //res.send('You have discovered my secret!');
                res.redirect('/secrets');
            });
        }
    });
});


app.get('/secrets', (req, res) => {
    if(req.isAuthenticated()){
        User.find({'userSecret': {$ne: null}}, (error, usersFound) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(usersFound);
                res.render('secrets', {usersSecrets: usersFound});
            }
        });       
    } else {
        res.redirect('/login');
    }
}); 

//submit a secret
app.get('/submit', (req, res) => {
    if(req.isAuthenticated()){
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

app.post('/submit', (req, res) => {
    const submittedSecret = req.body.secret;
    console.log(req.user);

    User.findById(req.user.id, (error, userFound) => {
        if(!error){
            userFound.userSecret = submittedSecret;
            userFound.save((error) => {
                if(!error){
                    console.log('secret added');
                    res.redirect('/secrets');
                }
            });
        }
    });
});

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

const port = 5000;

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}.`);
});