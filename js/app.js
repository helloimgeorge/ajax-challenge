"use strict";

var commentUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ReviewApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'mnkGUAwKY0cn2fdEAxBlX8Rq3ItvJ4jD0JMgSAIh';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '8ng0qWZM6ZMxCev8dA7B3ybwusg2lIjXabpwrp01';
    })

    // controller
    .controller('ReviewsController', function($scope, $http) {
        $scope.comments = [];
        $scope.errorMessage = null;

        // retrieves all comments and sorts them
        $scope.getComments = function() {
            $scope.loading = true;

            $http.get(commentUrl)
                .success(function(data) {
                    $scope.comments = _.sortBy(data.results, 'score').reverse();
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });

        }; // end getComments method

        $scope.getComments();
        $scope.newComment = {rating: 0, name: '', title: '', body: '', score: 0};

        // add comment method
        $scope.addComment = function() {
            $scope.loading = true;

            $http.post(commentUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {rating: 1, name: '', title: '', body: '', score: 0};
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //addComment()

        // increment score method adds a score if user clicked thumbs icon
        $scope.incrementScore = function(comment, amt) {
            $http.put(commentUrl + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amt
                }
            })
                .success(function(responseData) {
                    if(responseData.score < 0) { // just in case score goes below 0, add score
                        $scope.incrementScore(comment, 1);
                    } else {
                        comment.score = responseData.score;
                    }
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; // end increment score method


        // delete comment method which will delete the information
        $scope.deleteComment = function(comment) {
            $scope.loading = true;

            $http.delete(commentUrl + '/' + comment.objectId)
                .success(function() {
                    $scope.getComments();
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; // end delete comment method
    });