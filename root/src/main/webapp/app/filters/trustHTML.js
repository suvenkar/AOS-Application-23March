/**
 * Created by correnti on 23/11/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('trustHtml', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
});