angular.module('CutenessOverflow.services', ['ionic'])

.factory('PhotoServiceInstagram', function ($http, $q) {
    var BASE_URL = "https://api.instagram.com/v1/tags/";
    var tag = "cute";
    var END_URL = "/media/recent?client_id=f4eb26f36e924426b533c1c9e57867a9&callback=JSON_CALLBACK";
    var items = [];
    var nextUrl = 0;  // next max tag id - for fetching older photos
    var NewInsta = 0; // min tag id - for fetching newer photos

    return {
        GetFeed: function (tag) {
            return $http.jsonp(BASE_URL + tag + END_URL).then(function (response) {

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
});



