'use strict'
var mongoose = require('mongoose');
var VideoData = require('./models/videoInfo.js');
var CanData = require('./models/canData.js');
var Auth = require('./controllers/auth.js');
var Home = require('./controllers/home.js');
var multiparty = require('connect-multiparty')();
var s3 = require('s3');
var config = require('./config.js');
var fs = require('fs');

var s3Client = s3.createClient({
    s3Options: {
        accessKeyId: config.AWS_KEY,
        secretAccessKey: config.SECRET
    }
})

module.exports = function(app) {

    // app.post('api/video', function(req, res) {
    //     res.send("SUCCESS");
    // })

    app.get('/login', Auth.render); // route for the login page
    app.get('/logout', Auth.logout); // route for logging out

    app.post('/login', Auth.login); // form request emdpoint for loggin in
    app.post('/register', Auth.register); // form request endpoint for user registration

    // DAHSBOARD
    app.all('/dashboard*', Auth.session); // protect all dashboard routes from unauthorized users
    app.get('/dashboard', (req, res) => { // renders the dashboard, break this out into another controller if needed!
        res.render('dashboard', req.session)
    });

    // Home page
    app.all('/home*', Auth.session);

    app.route('/home')
        .get(Home.get);

    app.route('/home/index')
        .get(Home.partials.index);

    app.route('/home/about')
        .get(Home.partials.about);

    app.route('/home/video')
        .get(Home.partials.video);

    app.route('/home/student')
        .get(Home.partials.student);

    app.route('/home/teacher')
        .get(Home.partials.teacher);

    app.route('/api/upsertVideoData')
        .post(function upsert(req, res) {
            //res.send("SUCCESS");
            //upsert: (req,res) => {
            if (req.params.id) {
                VideoData.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function(err, updatedVideoData) {
                    res.send(updatedVideoData);
                });
                // Let's add insert now!
                // we can test to see if the req.body is an array and
                // insert many zombies in one step
            } else if (req.body.length >= 1) {
                VideoData.insert(req.body, function(err, data) {
                    // This is another way of doing the same thing
                    // Zombie.collection.insert(req.body, function(err, data) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(data);
                    }
                });
                // add a single new zombie
            } else {
                // res.send(req.params.id);
                res.json(req.body);

            }
        });


    app.get('/api/video', function(req, res) {
        VideoData.find({}).populate('refID').exec((err, video) => {
            res.json(video);
        });
    });

    app.post('/api/saveTips', function(req, res) {
        console.log(req.body)

        //save canData into the database
        var canvasData = new CanData(req.body);

        // TODO: use findOneAndUpdate() to check if canData for this video already exists and then update if so
        // canvasData.save((err, user) => {
        //     if (err) {
        //         console.error('Error storing canvas data in the database', err.message);
        //         res.send(err);
        //     } else {
        //         res.send({
        //             status: 200,
        //             message: 'canData save success'
        //         }); // send a success message
        //     }
        // });

        CanData.findOneAndUpdate({ title: req.body.title }, req.body, { new: true, upsert: true }, function(err, updatedTips) {
            if (err) {
                console.error('Error saving tips in the database', err.message);
                res.send(err);
            } else {
                res.send({
                    status: 200,
                    message: 'tips save success'
                }); // send a success message
            }
        })
    })

    app.get('/api/getTips', function(req, res) {
        console.log(req.query.title);

        CanData.findOne({ title: req.query.title }, function(err, data) {
            if (err) {
                console.log("Error getting tips from database");
                res.send(err);
            } else {
                console.log("canData from DB: ", data);
                res.json(data);
            }
        })

    })

    app.get('/me', function(req, res) {
        //user: req.session.name
        console.log(req.session.name);
    });

    app.post('/api/video', multiparty, function(req, res) {
        var body = req.body.data;
        var file = req.files.files;
        //var filePath = 'golf/' + (new Date()).getTime() + file.name // This is WHERE in your s3 bucket, the file will be stored

        var timestamp = new Date().getTime()

        console.log("FILE: ", file);
        console.log(__dirname + "/../client/videos/" + file.originalFilename)
        fs.rename(file.path, __dirname + "/../client/videos/" + timestamp + file.originalFilename);

        var fullUrl = req.protocol + '://' + req.get('host') + "/videos/" + timestamp + file.originalFilename;
        console.log("Video URL: ", fullUrl);

        var video = new VideoData({
            title: timestamp + file.originalFilename,
            timeStamp: Date.now(),
            videoURL: fullUrl,
            user: req.session.name,
        });

        video.save((err, user) => {
            if (err) {
                console.error('Error storing video in the database', err.message);
                res.send(err);
            } else {
                res.send({
                    status: 200,
                    message: 'Video save success'
                }); // send a success message
            }
        });


        //     video.save((err, user) => {
        //         if (err) {
        //             console.error('Error storing video in the database', err.message);
        //         } else {
        //             res.send({
        //                 status: 200,
        //                 message: 'Video save success'
        //             }); // send a success message
        //         }
        //     });

        // var uploader = s3Client.uploadFile({
        //     localFile: file.path,
        //     s3Params: {
        //         Bucket: 'johnnygreengo', // "droplet" / container for s3 storage
        //         Key: filePath, // filepath on the bucket where the image will live
        //         ACL: 'public-read', // Access control
        //     }
        // });

        // uploader.on('progress', function() {
        //     console.log("progress", uploader.progressAmount, uploader.progressTotal, ((uploader.progressAmount / uploader.progressTotal) * 100) + '%')
        // });


        // uploader.on('end', function() {
        //     // Where all the interesting stuff will happen
        //     var url = s3.getPublicUrlHttp('johnnygreengo', filePath) //Takes Bucket name and filepath IN the bucket
        //     console.log('URL', url)

        //     console.log("USER: ", req.session);

        //     var video = new VideoData({
        //         title: file.name,
        //         timeStamp: Date.now(),
        //         videoURL: url,
        //         user: req.session.name,
        //     });

        //     video.save((err, user) => {
        //         if (err) {
        //             console.error('Error storing video in the database', err.message);
        //         } else {
        //             res.send({
        //                 status: 200,
        //                 message: 'Video save success'
        //             }); // send a success message
        //         }
        //     });

        //body.postVideo = url;
        //var newZombie = new Zombie(body);

        //newZombie.save(function(err, doc) {
        //res.send(doc)
        //})
        //});
    });
}