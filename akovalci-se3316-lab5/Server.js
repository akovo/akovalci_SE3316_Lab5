// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose'); 

var User = require('./src/models/user.js');
var Collection = require('./src/models/collection.js');
var Policy = require('./src/models/policy.js');
var Log = require('./src/models/log.js');
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
var secretKey = "engGoesRa2017";
var port = 8081;        // set our port
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

//userCollections GET enables finding all collections based on a username to display on their home page
router.route('/userCollections').get(function(req,res){
    Collection.find({owner:req.query.name},function(err, collections){
        if(err) throw err;
        res.send(collections);
    });
//userCollections DELETE handles the deletion of collections by ID
}).delete(function(req,res){
    Collection.find({'_id':req.query.id})
    .remove(function (err,deleted) {
        if (err) throw err;
        Collection.find({owner:req.query.user},function(err,collections){
            if(err) throw err;
            res.send(collections);
        });
    });
});
//rate PUT handlees the rating of collections 
router.route('/rate').put(function(req,res){
    Collection.findOne({_id:req.body.collection._id},function(err, collection) {
        if(err) throw err;
        //if the collection has no raters, initialize the values and add a rating
        if(collection.raters==null){
            //collection has no ratings
            collection.raters = [];
            collection.ratings = [];
            collection.raters.push(req.body.user);
            collection.ratings.push(req.body.rate);
            collection.rating = calculateRating(collection.ratings);
            collection.save(function(err,status){
                if(err) throw err;
                res.json({message:"rated"});
            });
        }
        //If the user has already rated, replace the rating with their new one by finding the index where it was pushed
        else if(collection.raters.includes(req.body.user)){
            //User has already rated, replace their old rating with the new one
            collection.ratings[collection.raters.indexOf(req.body.user)]=req.body.rate;
            collection.rating = calculateRating(collection.ratings);
            collection.save(function(err,status){
                if(err) throw err;
                res.json({message:"rated"});
            });
        //If the user hasn't rated this collection yet, add the rating
        }else if(!collection.raters.includes(req.body.user)){
            //user hasn't rated
            collection.raters.push(req.body.user);
            collection.ratings.push(req.body.rate);
            //Set the rating by calculating the average
            collection.rating = calculateRating(collection.ratings);
            collection.save(function(err,status){
                if(err) throw err;
                res.json({message:"rated"});
            });
        }
        
    })
});

//Calculates the average of all ratings for a collection
function calculateRating(ratings){
    var total = 0;
    for(var i = 0;i<ratings.length;i++){
        console.log(ratings[i]);
        total+=parseInt(ratings[i]);
    }
    var average = total/ratings.length;
    console.log(total + " " + average);
    return (total/ratings.length);
}
//Returns public collections for the home page
router.route('/publicCollections').get(function(req,res){
    //find all collections that are public, sort them, and return 10 
    Collection.find({priv:false,enabled:true},function(err, collections){
        if(err) throw err;
        collections.sort(function (b, a) {
            return a.rating - b.rating;
        });
        var collectionsToSend = [];
        for(var i = 0;i<collections.length; i++){
            collectionsToSend.push(collections[i]);
            if(i==9){
                break;
            }
        }
        res.send(collections);
    });
});
//Return all log items
router.route('/log').get(function(req,res){
    Log.find(function(err,logs){
        if(err) throw err;
        res.json(logs);
    });
})
//Add a new log item based on content and type
.post(function(req,res){
    var log = new Log();
    log.type = req.body.type;
    log.description = req.body.description;
    log.save(function(err){
        if(err) throw err;
        res.json({message:"log saved"});
    })
});
//Return all public collections,which are enabled, and not owned by the sender
router.route('/browseCollections').get(function(req,res){
    console.log(req.query);
    Collection.find({owner:{ $nin: [req.query.name] },enabled:true,priv:false},function(err, collections){
        if(err) throw err;
        res.send(collections);
    });
});
//Return all collections with the search key entered by the admin 
router.route('/adminCollections').get(function(req, res) {
    console.log(req.query)
   Collection.find({name:req.query.name},(function(err, collections) {
       if(err) throw err;
       console.log(collections);
       res.json(collections);
   })); 
});
//Resend the user verification email based on the email passed through the request
router.route('/resend').put(function(req, res) {
    //create a new nodemailer transporter with sender email information
    var transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
           user: 'dylanandadampython@gmail.com',
           pass: 'DualDegree'
       }
    });
    //Text to be presented in the email
    var text = 'Please click the link to verify your account:';
    //Email options
    var mailOptions = {
        from: 'dylanandadampython@gmail.com', // sender address
        to: req.body.name, // list of receivers
        subject: 'Please Confirm your Account', // Subject line
        text: text + ' https://akovalci-se3316-lab5-akovo.c9users.io:8081/api/verify/'+ req.body.name   //, // plaintext body
    };
    //Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if(error) throw error;
        res.json({message:"Success!"});
    });
});
//Update privacy policy with the passed content
router.route('/privacy').put(function(req, res) {
    Policy.update({name: "privacy" }, { $set: { content: req.body.content }}, function (err) {
         if(err) throw err;
         res.json({message:"privacy policy updated"});
     });
//Retrieve the privacy policy. If the policy doesn't exist, add the generic one stored here
}).get(function(req,res){
    Policy.findOne({name:"privacy"},function(err,returnedPolicy){
        if(returnedPolicy==null){
            var policy = new Policy();
            policy.name="privacy";
            policy.content="space watch Privacy Policy\n\nThis privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.\n\nWhat personal information do we collect from the people that visit our blog, website or app?\n\nWhen ordering or registering on our site, as appropriate, you may be asked to enter your email address or other details to help you with your experience.\n\nWhen do we collect information?\n\nWe collect information from you when you register on our site or enter information on our site.\n\nHow do we use your information?\n\nWe may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:\n\nTo personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.\nTo improve our website in order to better serve you.\n\nHow do we protect your information?\n\nWe do not use vulnerability scanning and/or scanning to PCI standards.\nWe only provide articles and information. We never ask for credit card numbers.\nWe do not use Malware Scanning.\n\nYour personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.\n\nWe implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your personal information.\n\nAll transactions are processed through a gateway provider and are not stored or processed on our servers.\n\nDo we use 'cookies'?\n\nWe do not use cookies for tracking purposes\n\nYou can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.\n\nIf you turn cookies off, Some of the features that make your site experience more efficient may not function properly.that make your site experience more efficient and may not function properly.\n\nThird-party disclosure\n\nWe do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.\n\nThird-party links\n\nOccasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.\n\nGoogle\n\nGoogle's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en\n\nWe have not enabled Google AdSense on our site but we may do so in the future.\n\nCalifornia Online Privacy Protection Act\n\nCalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. - See more at: http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf\n\nAccording to CalOPPA, we agree to the following:\nUsers can visit our site anonymously.Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.\n\nYou will be notified of any Privacy Policy changes:\nOthers\nvia homepage\nCan change your personal information:\nBy emailing us\n\nHow does our site handle Do Not Track signals?\nWe honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.\n\nDoes our site allow third-party behavioral tracking?\nIt's also important to note that we do not allow third-party behavioral tracking\n\nCOPPA (Children Online Privacy Protection Act)\n\nWhen it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States' consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.\n\nWe do not specifically market to children under the age of 13 years old.Do we let third-parties, including ad networks or plug-ins collect PII from children under 13?\n\nFair Information Practices\n\nThe Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.\n\nIn order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:\nWe will notify you via email Within 7 business days\n\nWe also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.\n\nCAN SPAM Act\n\nThe CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.\n\nWe collect your email address in order to:\n\nTo be in accordance with CANSPAM, we agree to the following:\n-Not use false or misleading subjects or email addresses.\n-Identify the message as an advertisement in some reasonable way.\n-Include the physical address of our business or site headquarters.\n-Monitor third-party email marketing services for compliance, if one is used.\n-Honor opt-out/unsubscribe requests quickly.\n-Allow users to unsubscribe by using the link at the bottom of each email.\n\nIf at any time you would like to unsubscribe from receiving future emails, you can email us at\nFollow the instructions at the bottom of each email.and we will promptly remove you from ALL correspondence.\n\nContacting Us\n\nIf there are any questions regarding this privacy policy, you may contact us using the information below.\n\nSpace Watch\n958 Richmond St.\nLondon, Ontario N6A 3J5\nCanada\ndylanAndAdamPython@gmail.com";
            policy.save(function(err){
                if(err) throw err;
                res.json({content:policy.content});
            })
        }
        else{
            res.json(returnedPolicy);    
        }
    });
//Add a privacy policy; only possible if one does not exist
}).post(function(req,res){
    Policy.findOne({name:"privacy"},function(err,policy){
        if(policy != null){
            res.json({message:"cannot add new privacy policy"});
        }
        else{
            var policy = new Policy();
            policy.name="privacy";
            policy.content=req.body.content;
            policy.save(function(err){
                if(err) throw err;
                res.json({message:"privacy policy added"});
            });
        }
    });
});
//Update dmca policy with the passed content
router.route('/dmca').put(function(req, res) {
     Policy.update({name: "DMCA" }, { $set: { content: req.body.content }}, function (err) {
         if(err) throw err;
         res.json({message:"DMCA policy updated"});
     });
})
//Retrieve the dmca policy. If the policy doesn't exist, add the generic one stored here
.get(function(req,res){
    Policy.findOne({name:"DMCA"},function(err,returnedPolicy){
        if(returnedPolicy==null){
            var policy = new Policy();
            policy.name="DMCA";
            policy.content="Space Watch complies with the notice and takedown procedures defined in section 512(c) of the Digital Millennium Copyright Act (“DMCA”), which applies to content reported and removed for infringing United States copyrights. If your content was removed under the notice and counter-notice procedures of the DMCA, you will receive instructions about the counter-notification process, including how to file a counter-notification, in the warning we send you. When we receive an effective DMCA counter-notification, we promptly forward it to the reporting party. If the reporting party does not notify us that they have filed an action seeking a court order to restrain you from engaging in infringing activity on Space Watch related to the material in question within 10-14 business days, we may restore or cease disabling eligible content under the DMCA. In rare instances, we may not be able to restore content due to technical limitations. In that event, we’ll send you an update letting you know you may repost the content to the site at your discretion. Restored content will not be counted against you if your account is ever reviewed for potentially violating our policies about repeat infringement. Report DMCA infrigement to:dylanandadampython@gmail.com";
            policy.save(function(err){
                if(err) throw err;
               res.json({content:policy.content});
            });
        }else{
            res.json(returnedPolicy);
        }
    });
})
//Add a privacy policy; only possible if one does not exist
.post(function(req,res){
    Policy.findOne({name:"DMCA"},function(err,policy){
        if(policy != null){
            res.json({message:"cannot add new DMCA policy"});
        }
        else{
            var policy = new Policy();
            policy.name="DMCA";
            policy.content=req.body.content;
            policy.save(function(err){
                if(err) throw err;
                res.json({message:"DMCA policy added"});
            })
        }
    });
});
//Update the state of the collection (disabled or enabled) and if disabling a collection, notify the owner of the collection that it has been disabled
router.route('/collectionState').put(function(req, res) {
    Collection.update({ _id: req.body.id }, { $set: { enabled: req.body.state }}, function (err) {
                if (err) throw(err);
                if(req.body.state==false){
                    var transporter = nodemailer.createTransport({
                       service: 'Gmail',
                       auth: {
                           user: 'dylanandadampython@gmail.com',
                           pass: 'DualDegree'
                       }
                    });
                    var text = 'Your collection ' + req.body.name + ' has been disabled due to DMCA Copyright infringement. If you believe this content does not infringe on DMCA copyright law, please respond to this email with a counter-dispute within 5 business days.';
                    var mailOptions = {
                        from: 'dylanandadampython@gmail.com', // sender address
                        to: req.body.owner, // list of receivers
                        subject: 'IMPORTANT: Your collection has been linked to copy right infringement', // Subject line
                        text: text  //, // plaintext body
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                            res.json({yo: 'error'});
                        }else{
                            res.json({message:"state changed"});
                        };
                    });
                }
                else{
                    res.json({message:"state changed"});
                }
                
             });
});
//Add a new collection 
router.route('/collection').post(function(req,res){
    var collection   = new Collection({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner,
        priv: req.body.priv,
        enabled:true,
        rating:0
    });
    collection.save(function(err){
        if(err) throw err;
        
        res.json({message:"Saved"});
    })
})
//Retrieve all collections
.get(function(req,res){
     Collection.find(function(err, collections) {
            if (err)
                res.send(err);
            res.json(collections);
        });
})
//Update a collection based on its ID with the passed fields
.put(function(req,res){
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
})
//Remove a collection with a particular ID
.delete(function(req,res){
    Collection.update( {_id: req.body.id}, { $pullAll: {images: [req.body.image] } },function(err,stats){
          Collection.find({_id: req.body.id},function(err,col){
              res.json(col[0].images);
          })
    });
});

//Update the passed array of collections with the passed image URL, storing the image in that collection
router.route('/images').put(function(req,res){
    console.log(req.body);
    for(var i =0; i < req.body.collections.length;i++){
        Collection.update(
           { _id: req.body.collections[i]  },
           { $push: { images: req.body.image } }
        , function(err,newCol){
            
        })
    }
    res.json({message:"Done!"});
});
router.route('/users')
    //Check if a user exists, and add that user to the User collection, notifying the user by email to verify
    .post(function(req, res) {
        User.findOne({ username: req.body.name }, function(err, user) {
            if (err) throw err;
            if(user == null){
                 var user = new User({
                     username: req.body.name,
                     password: req.body.pass,
                     verified: false,
                     admin:false
                 });
                user.save(function(err) {
                    if (err)
                        res.send(err);
                    //Send verification email, as described in above email sending    
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
                //Notify the user that user already exists
                res.json({ message: 'user already exists!' });
            }
        });
    //Retrieve a list of users
    }).get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
//Add an administrator if they're entry matches the secret code and their user name doesn't exist in the User collection
router.route('/addAdmin').post(function(req,res){
    console.log(req);
    User.findOne({username:req.body.name},function(err,user){
       if(req.body.secretKey==secretKey&&user==null){
       var user = new User({
            username: req.body.name,
            password: req.body.pass,
            verified: true,
            admin:true
        });
        user.save(function(err){
            if(err) throw err;
            res.json({message:"Admin Added"});
        })
       }
       else if(req.body.secretKey!=secretKey){
           res.json({message:"Wrong Secret Key"});
       } 
       else if(user!=null){
           res.json({message:"User already exists!"});
       }
    });
});
//Endpoint used by individuals verifying emails, sets the verified attribute to true
router.route('/verify/:email').get(function(req,res){
    User.update({ username: req.params.email }, { $set: { verified: true }}, function (err, newUser) {
                if (err) throw(err);
                res.send("Verified!");
             });
});
//Validate the user login input, and respond based on the state of their login attempt
router.route('/login')
    .post(function(req, res) {
        User.findOne({ username: req.body.name }, function(err, user) {
            if (err) throw err;
            if(user == null){
                res.json({message:"User not found"})
            }
            else if(user.verified == false){
                res.json({ message: 'User not verified!' });
            }
            else if(user.admin==true){
                user.comparePassword(req.body.pass, function(err, isMatch) {
                    if (err) throw err;
                    if(isMatch){
                        res.json({ message: 'Admin Success' });
                    }
                    else{
                        res.json({ message: 'Invalid Pass!' });    
                    }
                });
            }
            else{
                //Match password if the username is verified and exists
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