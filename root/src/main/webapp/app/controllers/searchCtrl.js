
/**
 * Created by correnti on 24/02/2016.
 */



define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('searchCtrl', ['$scope', '$stateParams', 'categoryService', 'category',
        function (s, $stateParams, categoryService, paramsToReturn) {

            s.catId = $stateParams.id;

            s.paramsToPass = paramsToReturn;

            s.categoryData = paramsToReturn.searchResult.length > 0 ? paramsToReturn.searchResult[0] : [];

            s.noProducts = s.categoryData.products == undefined || s.categoryData.products.length == 0;

            s.searchKey = paramsToReturn.searchKey;

            Helper.forAllPage();

        }]);

});

