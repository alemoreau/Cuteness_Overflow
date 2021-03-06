// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('CutenessOverflow', ['ionic', 'CutenessOverflow.controllers', 'CutenessOverflow.services'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
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

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.html",
          controller: 'AppCtrl'
      })

      .state('app.cards', {
          url: "/cards",
          views: {
              'menuContent': {
                  templateUrl: "templates/cards.html",
                  controller: 'CardsCtrl'
              }
          }
      })

      .state('app.stats', {
          url: "/stats",
          views: {
              'menuContent': {
                  templateUrl: "templates/stats.html",
                  controller: 'StatsCtrl'
              }
          }
      })
      .state('app.playlists', {
          url: "/info",
          views: {
              'menuContent': {
                  templateUrl: "templates/info.html",
                  controller: 'InfoCtrl'
              }
          }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/cards');
});
