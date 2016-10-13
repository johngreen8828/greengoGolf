angular.module('module.home', ['ngRoute', 'ngFileUpload', 'ngSanitize'])
    .config(Router)
    .controller('VideoController', VideoController)
    .filter("trustUrl", ['$sce', function($sce) {
        return function(videoUrl) {
            return $sce.trustAsResourceUrl(videoUrl);
        };
    }]);


// $routeProvider comes from the ngRoute module
Router.$inject = ['$routeProvider'];

function Router($routeProvider) {

    // If a user tries to go to a page that doesn't exist, take them back to the home page
    $routeProvider.otherwise({ redirectTo: '/' });

    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl: '/home/index'
        })
        // route for the about page
        .when('/about', {
            templateUrl: '/home/about'
        })
        .when('/teacher', {
            templateUrl: '/home/teacher'
        })
        .when('/student', {
            templateUrl: '/home/student'
        })
        // .when('/logout', {
        //         templateUrl: '/login'
        // })
        // route for the video page
        .when('/video', {
            templateUrl: '/home/video',
            controller: 'VideoController as vCtrl'
        });
}

VideoController.$inject = ['$http', 'Upload'];


function VideoController($http, Upload) {
    console.info('VideoController loaded!');

    var vCtrl = this;
    vCtrl.canData = [];

    vCtrl.getVideos = function() {
        $http.get('/api/video').then(function(res) {
            console.log("Video list: ", res.data);
            vCtrl.videoList = res.data;
        })
    }

    vCtrl.getTips = function() {
        console.log("ALSO RUNNING", vCtrl.activeVideo);

        $http.get('/api/getTips?title=' + vCtrl.activeVideoTitle).then(function(res) {
            console.log("Got tips for ", vCtrl.activeVideoTitle);

            console.log("getTips response: ", res)

            if (res.data) {
                vCtrl.canData = res.data.canData;
            } else {
                vCtrl.canData = [];
            }
        });
    }

    vCtrl.saveDataArray = function() {
        $http.post('/api/saveTips', { title: vCtrl.activeVideoTitle, canData: vCtrl.canData }).then(function(res) {
            console.log("Tips saved!", res.data);
        });
    }

    vCtrl.postVideo = function() {
        console.log(vCtrl.videoFile);

        //NEW 
        Upload.upload({
            url: '/api/video',
            method: 'POST',
            data: {
                files: vCtrl.videoFile, // this could potentially be an array of files or just a single file object
                data: vCtrl.videoFile.name
            }
        }).then(function(res) {
            console.log(res.data);
        });

        // $http({
        //     url: '/api/video',
        //     data: homeData,
        //     method: 'POST'
        // });
    }
    vCtrl.uploadVideo = function() {
        console.log(files.file.name);
        console.log(files.file.path);
        console.log(files.file.type);
        var file = __dirname + "/" + files.file.name;

        fs.readFile(files.file.path);
        fs.writeFile(file);
        var filename = files.file.name;
    }

    vCtrl.activeSnap = {};

    window.vCtrl = vCtrl;

    vCtrl.openModal = function() {
        console.log('Open Modal event');
        vCtrl.editing = true;
        //var goTo = confirm(vCtrl.canData);
        //Open Modal Window
        document.getElementById("modalBox").style.zIndex = "3";
        var vid = document.querySelector("video");
        vCtrl.vid = vid; //attach video to controller
        var h = vCtrl.vid.videoHeight * 0.25;
        var w = vCtrl.vid.videoWidth * 0.25;
        console.log(vid, h, w);
        vCtrl.vid.pause();
        var canvas = document.getElementById('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(vCtrl.vid, 0, 0, w, h);
        var tmpImgData = canvas.toDataURL(); // Read succeeds, canvas won't be dirty.
        console.log("Time Stamp of the pic--->" + vCtrl.vid.currentTime);
        console.log("height: " + h + "width: " + w)
        vCtrl.modalBoxStyles = {
            "height": h + "px",
            "width": w + "px"
        }
        vCtrl.saveModal = function() {
            if (vCtrl.activeSnap.imgSnapped) {
                vCtrl.editing = false;
                vCtrl.activeSnap.imgComments = vCtrl.canData.tips;
                vCtrl.canData.tips = "";
                vCtrl.activeSnap = {};
            } else {

                vCtrl.canData.push({
                    imgGName: "", // TODO: fill in with logged in user's name
                    imgGEmail: "",
                    imgSwingSegment: "",
                    imgData: tmpImgData,
                    imgTimeStamp: vCtrl.vid.currentTime,
                    imgComments: vCtrl.canData.tips,
                    imgScreenShotNum: vCtrl.canData.length,
                    imgSnapped: true,
                    videoUrl: vCtrl.activeVideo
                })
            }

            vCtrl.editing = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            vCtrl.canData.tips = "";
        }
        vCtrl.Close = function() {
            vCtrl.editing = false;

        }

        vCtrl.removeItem = function($index) {
            vCtrl.canData.splice($index, 1);
            vCtrl.activeSnap = {};
            vCtrl.canData.tips = "";
        }


        vCtrl.loadSnapshot = function(index, imageData, tips, event) {
            //console.log("index " + index);
            vCtrl.activeSnap = imageData;
            vCtrl.activeSnap.imgSnapped = true;

            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(event.target, 0, 0);
            vCtrl.editing = true;
            vCtrl.canData.tips = imageData.imgComments;

        }

        vCtrl.moveModal = function() {
            var selected = null, // Object of the element to be moved
                x_pos = 0,
                y_pos = 0, // Stores x & y coordinates of the mouse pointer
                x_elem = 0,
                y_elem = 0; // Stores top, left values (edge) of the element

            // Will be called when user starts dragging an element
            function _drag_init(elem) {
                // Store the object of the element which needs to be moved
                selected = elem;
                x_elem = x_pos - selected.offsetLeft;
                y_elem = y_pos - selected.offsetTop;
            }

            // Will be called when user dragging an element
            function _move_elem(e) {
                x_pos = document.all ? window.event.clientX : e.pageX;
                y_pos = document.all ? window.event.clientY : e.pageY;
                if (selected !== null) {
                    selected.style.left = (x_pos - x_elem) + 'px';
                    selected.style.top = (y_pos - y_elem) + 'px';
                }
            }

            // Will be called when user dragging an element
            function _move_elem(e) {
                x_pos = document.all ? window.event.clientX : e.pageX;
                y_pos = document.all ? window.event.clientY : e.pageY;
                if (selected !== null) {
                    selected.style.left = (x_pos - x_elem) + 'px';
                    selected.style.top = (y_pos - y_elem) + 'px';
                }
            }

            // Destroy the object when we are done
            function _destroy() {
                selected = null;
            }

            // TODO - fix this!
            // Bind the functions...
            document.getElementById('modalBox').onmousedown = function() {
                _drag_init(this);
                // return false;
            };

            document.onmousemove = _move_elem;
            document.onmouseup = _destroy;
            // }

        }
    }




}