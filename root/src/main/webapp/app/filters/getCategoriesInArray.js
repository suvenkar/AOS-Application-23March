/**
 * Created by correnti on 17/01/2016.
 */



define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('getCategoriesInArray', function(){
        return function(_a, categoriesInArray, categoryId) {

            if(categoriesInArray[0] == undefined){
                return _a;
            }
            var categories = [];
            for (var i = 0; i < categoriesInArray.length; i++){
                var categ = categoriesInArray[i];
                categories.push({
                    id : categ.categoryId,
                    name : categ.categoryName,
                    checked : categoryId == categ.categoryId,
                });
            }
            return categories;
        };
    });
});

