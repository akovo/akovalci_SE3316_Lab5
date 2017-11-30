// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose'); 

var User = require('./src/models/user.js');
var Collection = require('./src/models/collection.js');
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
router.route('/userCollections').get(function(req,res){
    console.log(req.query);
    Collection.find({owner:req.query.name},function(err, collections){
        if(err) throw err;
        
        res.send(collections);
    });
}).delete(function(req,res){
    Collection.find({'_id':req.query.id})
    .remove(function (err,deleted) {
        if (err) throw err;
        Collection.find({owner:req.query.user},function(err,collections){
            if(err) throw err;
            res.send(collections);
        })
    });
});
router.route('/publicCollections').get(function(req,res){
    console.log(req.query);
    Collection.find({priv:false},function(err, collections){
        if(err) throw err;
        res.send(collections);
    });
});
router.route('/collection').post(function(req,res){
    var collection   = new Collection({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner,
        priv: req.body.priv,
        rating:0
    });
    collection.save(function(err){
        if(err) throw err;
        
        res.json({message:"Saved"});
    })
}).get(function(req,res){
     Collection.find(function(err, collections) {
            if (err)
                res.send(err);
            res.json(collections);
        });
}).put(function(req,res){
    Collection.update({ _id: req.body._id },
    { $set: {
        name:req.body.name,
        description:req.body.description,
        owner:req.body.owner,
        priv:req.body.priv}},
    function (err, newUser) {
        if (err) return handleError(err);
        res.json({message:"Saved"});
    });
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
        console.log("made it");
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
router.route('/verify/:email').get(function(req,res){
    User.update({ username: req.params.email }, { $set: { verified: true }}, function (err, newUser) {
                if (err) return handleError(err);
                res.send("Verified!");
             });
});
router.route('/login')
    .post(function(req, res) {
        User.findOne({ username: req.body.name }, function(err, user) {
            if (err) throw err;
            
            console.log(user.verified);
            if(user == null){
                res.json({message:"User not found"})
            }
            else if(user.verified == false){
                res.json({ message: 'User not verified!' });
            }
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