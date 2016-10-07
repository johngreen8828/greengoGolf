angular.module('module.video', [])
    .controller('VideoController', Video);

function Video() {
    console.info('Home.initialized');

    var video = this;

    //upload video from Amazon s3
    //edit video with either voice or text
    //save video and send to Amazon s3


}