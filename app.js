const express = require('express');
const bodyParser = require('body-parser');


// init express app
const app = express();


// Setup EJS template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// connecting to MongoDB
const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/applicationdb';
const objectId = require('mongodb').ObjectId;

MongoClient.connect(mongoURL, function (err, database) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected Succesfully")
    }
    applications = database.collection('applications'); //global variable
});


// Routes
app.get('/', (req, res) => {
    res.render("index");
});


app.get('/applications', function (req, res) {

    applications.find({}).toArray(function (err, docs) {
        if (err) {
            console.log(err);
        }
        res.render('applications', {
            applications: docs
        });
    });
});


app.post('/applications/add', function (req, res) {

    applications.insert({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.name,
        lastname: req.body.surname,
        gender: req.body.gender,
        birthday: req.body.bday,
        degree: req.body.grades,
        studyfield: req.body.stdyfield,
        from: req.body.from,
        to: req.body.to,
        interestedfield: req.body.intfield
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/applications');
    });
});


app.get('/applications/edit/:id', function (req, res) {

    var id = objectId(req.params.id);
    applications.findOne({
        _id: id
    }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        res.render('edit', {
            applications: doc
        });
    });
});


app.post('/applications/update/:id', function (req, res) {

    var id = objectId(req.params.id);
    applications.updateOne({
        _id: id
    }, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.name,
            lastname: req.body.surname,
            gender: req.body.gender,
            birthday: req.body.bday,
            degree: req.body.grades,
            studyfield: req.body.stdyfield,
            from: req.body.from,
            to: req.body.to,
            interestedfield: req.body.intfield
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/applications');
    });
});


app.get('/applications/delete/:id', function (req, res) {

    var id = objectId(req.params.id);
    applications.deleteOne({
        _id: id
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/applications');
        }
    });
});


// running app
app.listen(3000, () => {
    console.log("App running at http://localhost:3000");
});
