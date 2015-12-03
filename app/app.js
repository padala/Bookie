'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ui.router',
    'angular-momentjs',
    'myApp.books'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider.state('app', {
        url: '/',
        views: {
            'header': {
                templateUrl: 'partials/header.html',
                controller: 'BooksCtrl'
            },
            'content': {
                templateUrl: 'book/views/books.html',
                controller: 'BooksCtrl'
            },
            'footer': {
                templateUrl: 'partials/footer.html'
            }
        }
    })

    //View1 state with multiple Views
    //Having ^ symbol before url so that double slashes are not shown in the nested view  urls
    .state('app.view1State', {
            url: '^/view1',
            views: {
                'content@': {
                    templateUrl: 'book/views/books.html',
                    controller: 'BooksCtrl'
                }
            }
        })
        .state('app.view1ChildState', {
            url: '^/detail/:showId/:recommendedItems',
            views: {
                'content@': {
                    templateUrl: 'book/views/bookDetail.html',
                    controller: 'BooksDetailCtrl'
                }
            }
        });
}]);