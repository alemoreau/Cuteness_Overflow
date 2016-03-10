// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('CutenessOverflow', ['ionic', 'ionic.contrib.ui.tinderCards'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.directive('noScroll', function ($document) {

          return {
              restrict: 'A',
              link: function ($scope, $element, $attr) {

                  $document.on('touchmove', function (e) {
                      e.preventDefault();
                  });
              }
          }
      })


.factory('PhotoServiceInstagram', function ($http, $q) {
    var BASE_URL = "https://api.instagram.com/v1/tags/";
    var tag = "cute";
    var END_URL = "/media/recent?client_id=f4eb26f36e924426b533c1c9e57867a9&callback=JSON_CALLBACK";
        var items = [];
        var nextUrl = 0;  // next max tag id - for fetching older photos
        var NewInsta = 0; // min tag id - for fetching newer photos

        return {
            GetFeed: function (tag) {
                return $http.jsonp(BASE_URL+tag+END_URL).then(function (response) {

                    items = response.data.data;
                    nextUrl = response.data.pagination.next_max_tag_id;
                    NewInsta = response.data.pagination.min_tag_id;
                    console.log(nextUrl, NewInsta);

                    return items;

                });
            },
            GetNewPhotos: function () {
                return $http.jsonp(BASE_URL + '&min_tag_id=' + NewInsta).then(function (response) {

                    items = response.data.data;
                    if (response.data.data.length > 0) {
                        NewInsta = response.data.pagination.min_tag_id;
                    }

                    return items;

                });
            },

            /**
             * Always returns a promise object. If there is a nextUrl, 
             * the promise object will resolve with new instragram results, 
             * otherwise it will always be resolved with [].
             **/
            GetOldPhotos: function (tag) {
                if (typeof nextUrl != "undefined") {
                    return $http.jsonp(BASE_URL + tag + END_URL + '&max_tag_id=' + nextUrl).then(function (response) {

                        if (response.data.data.length > 0) {
                            nextUrl = response.data.pagination.next_max_tag_id;
                        }

                        items = response.data.data;


                        return items;

                    });
                } else {
                    var deferred = $q.defer();
                    deferred.resolve([]);
                    return deferred.promise;
                }
            }

        }
    })


 .controller('CardsCtrl', function ($scope, TDCardDelegate, PhotoServiceInstagram) {

      $scope.items = []

      var tag = "cute"
      PhotoServiceInstagram.GetFeed(tag).then(function (items) {
          $scope.items = items.concat($scope.items);
      });

      $scope.noMoreItemsAvailable = ($scope.items.length === 0);
      $scope.noEnoughItemsAvailable = ($scope.items.length < 10);

  

      $scope.cardDestroyed = function (index) {
          $scope.items.splice(index, 1);
          $scope.noMoreItemsAvailable = ($scope.items.length === 0);
          $scope.noEnoughItemsAvailable = ($scope.items.length < 10);
          if ($scope.noEnoughItemsAvailable) {
              $scope.loadMore(tag);
          }
          else {
              console.log($scope.items[0]);
          }
      };


      $scope.loadMore = function () {
          PhotoServiceInstagram.GetOldPhotos(tag).then(function (items) {

              //$scope.items = $scope.items.concat(items); // not very natural
              $scope.items = items.concat($scope.items); // more natural
              if (items.length === 0) {
                  $scope.noMoreItemsAvailable = true;
              }

          });
      };

  })

 .controller('CardCtrl', function ($scope, TDCardDelegate) {
      $scope.cardSwipedLeft = function (index) {
          console.log('LEFT SWIPE');
          $scope.addCard();
      };
      $scope.cardSwipedRight = function (index) {
          console.log('RIGHT SWIPE');
          $scope.addCard();
      };
 });
