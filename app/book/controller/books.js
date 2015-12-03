'use strict';

angular.module('myApp.books', ['ngRoute', 'simplePagination'])

.controller('BooksCtrl', ["$scope", "$http", "BooksService", "$state", "Pagination", function($scope, $http, BooksService, $state, Pagination) {
        $scope.genreCategories = [];
        $scope.genreNames = [];
        $scope.retrivedData = [];
        $scope.pagination = Pagination.getNew(9);
        BooksService.list().then(function(data) {
            $scope.retrivedData = data;
            var completeList = data;

            // Getting unique genre categories
            var genreCategories = [];
            _.each(completeList, function(item) {
                genreCategories.push(item.genre.category);
            });
            $scope.genreCategories = _.uniq(genreCategories);

            // Getting unique genre names
            var genreNames = [];
            _.each(completeList, function(item) {
                genreNames.push(item.genre.name);
            });
            $scope.genreNames = _.uniq(genreNames);
            console.log($scope.retrivedData.length, $scope.pagination.perPage);
            $scope.pagination.numPages = Math.ceil($scope.retrivedData.length / $scope.pagination.perPage);
        });
        $scope.navigateToView2 = function(id) {
            var shows = $scope.retrivedData;
            var selectedShow = _.find(shows, function(show) {
                return id == show.id;
            });
            var filteredItems = _.filter(shows, function(show) {
                return (show.genre.category === selectedShow.genre.category) && (show.genre.name === selectedShow.genre.name);
            });
            var recommendedItems = _.sample(filteredItems, 3);

            $state.go('app.view1ChildState', {
                showId: id,
                recommendedItems: JSON.stringify(recommendedItems) //Angular UI Router doesn't support passing objects and arrays to stateParams
            });
        };
        $scope.updateLocalStorage = function() {
            localStorage.setItem("genreCategory", $scope.findMeTheBest);
            localStorage.setItem("genreName", $scope.booksAbout);
            localStorage.setItem("searchQuery", $scope.searchQuery);
        }
    }])
    .controller('BooksDetailCtrl', ['$scope', '$state', '$stateParams', "BooksService", function($scope, $state, $stateParams, BooksService) {
        $scope.selectedShow = BooksService.find($stateParams.showId);
        //Angular UI Router doesn't support passing objects and arrays to stateParams
        $scope.recommendedItems = JSON.parse($stateParams.recommendedItems);
    }])
    .factory('BooksService', ["$http", "$q", function($http, $q) {
        var shows = [];
        var defer = $q.defer();

        var list = function() {
            $http.get('data/book.json').then(function(data) {
                shows = data.data;
                defer.resolve(data.data);
            }, function(data) {
                defer.reject(data);
            });
            return defer.promise;
        };
        var find = function(id) {
            return _.find(shows, function(show) {
                return show.id == id;
            });
        };
        return {
            list: list,
            find: find
        };
    }]);