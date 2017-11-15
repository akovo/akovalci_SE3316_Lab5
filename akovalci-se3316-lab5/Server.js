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

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/app/client'));
app.use(cors({origin: '*'}));
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
        var user = new User();
        user.username = req.body.name;
        user.password = req.body.pass;
        user.save(function(err) {
            if (err) throw err;
        });
    }).get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });


// router.route('/messages')

//     // create a bear (accessed at POST http://localhost:8080/api/messages)
//     .post(function(req, res) {
//         var sanitized = req.body.description.replace(/[^\w\s!?.,'%$]/g, '');
//         var desc = new Description();      // create a new instance of the Description model
//         desc.course = req.body.course;  // set the Descriptions course (comes from the request)
//         desc.description = sanitized;
//         desc.time = new Date();
//         // save the description and check for errors
//         desc.save(function(err) {
//             if (err)
//                 res.send(err);

//             res.json({ message: 'description added!' });
//         });
//     })
//     .get(function(req, res) {
//         Description.find(function(err, descriptions) {
//             if (err)
//                 res.send(err);

//             res.json(descriptions);
//         });
//     });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
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