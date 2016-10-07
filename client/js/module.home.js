angular.module('module.home', ['ngRoute'])
    .config(Router)
    .controller('HomeController', Home);

Router.$inject = ['$routeProvider'];
// $routeProvider comes from the ngRoute module

function Router($routeProvider) {

    // If a user tries to go to a page that doesn't exist, take them back to the home page
    $routeProvider.otherwise({ redirectTo: '/' });

    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl: '/home/index',
            controller: 'HomeController as home'
        })
        // route for the about page
        .when('/about', {
            templateUrl: '/home/about',
            controller: 'AboutController as about'
        })
        // route for the video page
        .when('/video', {
            templateUrl: '/home/video',
            controller: 'VideoController as video'
        });
}

function Home() {
    console.info('Home controller loaded!');
}