const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userSecret: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = mongoose.model('User', userSchema);
