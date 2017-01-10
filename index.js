// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
mongoose.connect("mongodb://admin:5Vh_iuG4VuLr@"+process.env.OPENSHIFT_MONGODB_HOST+":"+process.env.OPENSHIFT_MONGODB_DB_PORT+"/lmttfy");
var User = require("./models/User");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Content-Type", "application/json");
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/users')
    .post(function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.save(function (err) {
            if(err){
                res.send(err);
            }
            res.json({message: 'User created.', id: user._id});
        })
    })
    .get(function (req, res) {
        User.find(function (err, users) {
            if(err){
                res.send(err);
            }
            res.json(users);
        })
    });

router.route('users/:user_id')
    .get(function (req, res) {
        User.findById(req.param.user_id, function (err, user) {
            if(err){
                res.send(err);
            }
            res.json(user);
        })
    })
    .put(function (req, res) {
        User.findById(req.param.user_id, function (err, user) {
            if(err){
                res.send(err);
            }
            user.username = req.body.username;
            user.email = req.body.email;
            user.save(function (err) {
                if(err){
                    res.send(err);
                }
                res.json({message: "User updated."});
            })
        })
    })
    .delete(function (req, res) {
        User.remove({_id: req.params.user_id}, function (err, user) {
            if(err){
                res.send(err);
            }
            res.json({message: "User deleted."});
        });
    })

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, ipaddress);
console.log('Magic happens on port ' + port);