// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users'); // connect to our database
//var Description     = require('./app/models/courseDescription.js');
var User     = require('./src/models/user.js');
// call the packages we need
var cors = require('cors');
var express    = require('express');        // call express
var app        = express();   // define our app using express
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(cors());
app.use(bodyParser.json());

var port = 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/users')
    .post(function(req, res) {
        User.findOne({ username: req.body.name }, function(err, user) {
            if (err) throw err;
            if(user == null){
                 var user = new User({
                     username: req.body.name,
                     password: req.body.pass,
                     verified: false
                 });
                user.save(function(err) {
                    if (err)
                        res.send(err);
                    var transporter = nodemailer.createTransport({
                       service: 'Gmail',
                       auth: {
                           user: 'dylanandadampython@gmail.com',
                           pass: 'DualDegree'
                       }
                    });
                    var text = 'Please click the link to verify your account:';
                    var mailOptions = {
                        from: 'dylanandadampython@gmail.com', // sender address
                        to: req.body.name, // list of receivers
                        subject: 'Please Confirm your Account', // Subject line
                        text: text + ' https://akovalci-se3316-lab5-akovo.c9users.io:8081/api/verify/'+ req.body.name   //, // plaintext body
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                            res.json({yo: 'error'});
                        }else{
                            console.log('Message sent: ' + info.response);
                            res.json({yo: info.response});
                        };
                    });
                    res.json({ message: 'user added, must verify' });
                });
            }
            else{
                res.json({ message: 'user already exists!' });
            }
        });
    }).get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
router.route('/verify/:email').get(function(req,res){
    console.log(" I made it");
    User.update({ username: req.params.email }, { $set: { verified: true }}, function (err, newUser) {
                if (err) return handleError(err);
                res.send("Verified!");
             });
});

router.route('/login')
    .post(function(req, res) {
        User.findOne({ username: req.body.name }, function(err, user) {
            if (err) throw err;

            if(user == null){
                res.json({message:"User not found"})
            }
            // test a matching password
            else{
                user.comparePassword(req.body.pass, function(err, isMatch) {
                    if (err) throw err;
                    if(isMatch){
                        res.json({ message: 'Success!' });
                    }
                    else{
                        res.json({ message: 'Invalid Pass!' });    
                    }
                });
            }
        });
    });

router.get('/', function(req, res) {
    console.log("get received");
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);