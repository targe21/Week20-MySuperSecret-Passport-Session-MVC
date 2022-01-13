const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
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


router.get('/secrets', (req, res) => {
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
router.get('/submit', (req, res) => {
    if(req.isAuthenticated()){
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

router.post('/submit', (req, res) => {
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

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});



module.exports = router;