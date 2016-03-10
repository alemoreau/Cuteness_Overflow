angular.module('CutenessOverflow.controllers', ['ionic', 'ionic.utils', 'ionic.contrib.ui.tinderCards', 'nvd3'])

.controller('CardsCtrl', function ($scope, $localstorage, TDCardDelegate, PhotoServiceInstagram) {

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

    $scope.cardSwipedLeft = function (index) {
        console.log('LEFT SWIPE');
        var cardSwiped = $scope.items[$scope.items.length - 1];
        console.log(cardSwiped);
        for (i = 0; i < cardSwiped.tags.length; i++) {
            var cardTag = cardSwiped.tags[i];
            var count = $localstorage.get("tag_" + cardTag, 0);
            $localstorage.set("tag_" + cardTag, --count);
            console.log(cardTag + " : " + count);
        }

    };
    $scope.cardSwipedRight = function (index) {
        console.log('RIGHT SWIPE');
        var cardSwiped = $scope.items[$scope.items.length - 1];
        console.log(cardSwiped);
        for (i = 0; i < cardSwiped.tags.length; i++) {
            var cardTag = cardSwiped.tags[i];
            var count = $localstorage.get("tag_" + cardTag, 0);
            $localstorage.set("tag_" + cardTag, ++count);
            console.log(cardTag + " : " + count);
        }

    };

})

.controller('CardCtrl', function ($scope, TDCardDelegate) {
    $scope.cardSwipedLeft = function (index) {
        console.log('LEFT SWIPE');
    };
    $scope.cardSwipedRight = function (index) {
        console.log('RIGHT SWIPE');
    };
})

.controller('AppCtrl', function ($scope) {
})

.controller('InfoCtrl', function ($scope) {
})

.controller('StatsCtrl', function ($scope, $localstorage) {

    Array.prototype.sortOn = function (key) {
        this.sort(function (a, b) {
            if (a[key] > b[key]) {
                return -1;
            } else if (a[key] < b[key]) {
                return 1;
            }
            return 0;
        });
    }


    var tags = $localstorage.getAllTags();
    tags.sortOn('count');
    tags.splice(20, tags.length - 20);
    var min_count = tags[19]['count'];
    var max_count = tags[0]['count'];
    var min_size = 10;
    var max_size = 40;
    console.log("tags : ");
    console.log(tags);
    console.log(min_count);
    console.log(max_count);

    var fill = d3.scale.category20();

    var layout = d3.layout.cloud()
        .size([400, 800])
        .words(tags.map(function (d) {
              return { text: d['tag'], size: min_size + ((max_size-min_size)*d['count'])/(max_count-min_count)};
          }))
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("svg").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
          .append("g")
            .attr("transform", "translate(" + layout.size()[0]/2.2 + "," + layout.size()[1]/2.2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
});
