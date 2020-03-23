/**
 * Created by kubany on 10/13/2015.
 */
define(['./module'], function (services) {
    'use strict';
    services.service('dealService', ['$http', '$q',
        '$timeout', 'userService',
        function ($http, $q, $timeout, userService) {
        // Return public API.
        return ({
            getDeals: getDeals,
            getDealOfTheDay: getDealOfTheDay
        });

        var deals;
        var dealOfTheDay;

        function getDeals() {
            var defer = $q.defer();
            if (deals) {
                defer.resolve(deals);
            }
            else {
                Helper.enableLoader();
                $http({
                    method: "get",
                    url: server.catalog.getDeals(),
                }).success(function (res) {
                    Helper.disableLoader();
                    Loger.Received(res)
                    deals = res;
                    defer.resolve(res)
                }).error(function (err) {
                    Helper.disableLoader();
                    Loger.Received(err)
                    defer.reject(null)
                });
            }
            return defer.promise;
        }


        function getDealOfTheDay() {

            var defer = $q.defer();
            if (dealOfTheDay && !userService.nv_slowPage()) {
                defer.resolve(dealOfTheDay);
            }
            else {
                var counterHttpCalls = 0;
                var times = userService.nv_slowPage() ? 3 : 1;
                for (var i = 0; i < times; i++) {
                    $timeout(function () {
                        $http({
                            method: "get",
                            url: server.catalog.getDealOfTheDay(),
                        }).success(function (res) {
                            Loger.Received(res)
                            dealOfTheDay = res;
                            if(counterHttpCalls + 1 == times){
                                defer.resolve(res)
                            }
                            else{
                                counterHttpCalls++;
                            }
                        }).error(function (err) {
                            Loger.Received(err)
                            defer.reject(null)
                        });
                    }, 600 * (i + 1));
                }
            }
            return defer.promise;
        }
    }]);
});