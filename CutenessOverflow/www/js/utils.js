angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        getAllTags: function() {
            var array = []
            for (var item in $window.localStorage) {
                var count = $window.localStorage[item]
                if (item.substring(0, 4) == "tag_") {
                    array.push({ tag: item.substring(4, 20), count: count });
                }
            }
            return array;
        }
    }
}]);
