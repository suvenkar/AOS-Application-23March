/**
 * Created by correnti on 10/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('productsFilterForCategoriesProduct', function ($filter) {

        function buildSeparator(val) {
            return "((START) " + val + " (END))";
        }

        return function (_a, searchResult, minPrice, maxPrice, productsInclude) {

            var categories = searchResult;

            var productsToReturn = [];

            if (productsInclude && Object.keys(productsInclude).length != 0) {

                for (var key in categories) {

                    var productsFilterized = [];
                    for (var index in categories[key].products) {

                        var prd = categories[key].products[index];
                        var count = 0;
                        if (prd.attributes) {

                            for (var name in productsInclude) {
                                var prop = '';

                                for (var index in productsInclude[name]) {
                                    prop += buildSeparator(productsInclude[name][index]);
                                }

                                for (var index in prd.attributes) {

                                    if (prop.indexOf(buildSeparator(prd.attributes[index].attributeValue)) > -1) {
                                        count++;
                                        break;
                                    }
                                }
                            }

                            var colors = '';
                            for (var index in productsInclude['COLOR']) {
                                colors += "(" + productsInclude['COLOR'][index].code + ")";
                            }

                        }

                        var colorFound = true;
                        if (prd.colors && colors != '') {
                            colorFound = false;
                            for (var index in prd.colors) {
                                if (colors.indexOf(prd.colors[index].code) > -1) {
                                    colorFound = true;
                                    count++;
                                    break;
                                }
                            }
                        }

                        var categoryFound = true;
                        var categoriesStr = '';
                        for (var index in productsInclude['CATEGORIES']) {
                            categoriesStr += "(" + productsInclude['CATEGORIES'][index] + ")";
                        }
                        if (prd.categoryId && categoriesStr != '') {
                            categoryFound = false;
                            if (categoriesStr.indexOf(prd.categoryId) > -1) {
                                categoryFound = true;
                                count++;
                            }
                        }


                        if (count == Object.keys(productsInclude).length &&
                            prd.price >= minPrice && prd.price <= maxPrice &&
                            colorFound && categoryFound) {
                            productsFilterized.push(prd);
                        }
                    }
                    productsToReturn.push({products: productsFilterized})
                }
            }
            else {
                for (var key in categories) {
                    var productsFilterized = [];
                    for (var index in categories[key].products) {
                        var prd = categories[key].products[index];
                        if (prd.price >= minPrice && prd.price <= maxPrice) {
                            productsFilterized.push(prd)
                        }
                    }
                    productsToReturn.push({products: productsFilterized})
                }
            }
            var v = $filter("filterFullArrayforAutoComplate")([], productsToReturn, null, -1);
            return v;
        }
    });
});


//for (var prdAttrIndex in prd.attributes) {
//    var prdAttr = prd.attributes[prdAttrIndex];
//
//    var include = productsInclude[prdAttr.attributeName];
//    var finded = false;
//    if (include) {
//        for (var includeIndex in include) {
//            if (prdAttr.attributeValue == include[includeIndex]) {
//                finded = true;
//                break;
//            }
//        }
//        if (finded) {
//            productsFilterized.push(prd);
//        }
//    }
//}


//for(var attrib in productsInclude){
//    console.log("")
//    console.log("================   productsInclude ======================")
//    console.log(productsInclude)
//    console.log(i)
//    console.log(productsInclude[i])
//    console.log("================   productsInclude ======================")
//    console.log("")
//}

//angular.forEach(products, function (product) {
//
//    if (Object.keys(productsInclude).length > 0) {
//        var found = 0;
//        for (var key in productsInclude) {
//            for (var i = 0; i < productsInclude[key].length; i++) {
//                var searchMatches = 0;
//                if (product.attributes) {
//                    var filterAttr = $filter('filter')(product.attributes, {attributeValue: productsInclude[key][i]}, false);
//                    var json = JSON.stringify(filterAttr[0]);
//                    var map = $.map(product.attributes, JSON.stringify);
//                    searchMatches = $.inArray(json, map);
//                }
//                if (searchMatches > -1) {
//                    found++;
//                }
//                for (var colorIndex = 0; colorIndex < product.colors.length; colorIndex++) {
//                    if (product.colors[colorIndex].code == productsInclude[key][i].code) {
//                        found++;
//                        break;
//                    }
//                }
//            }
//        }
//        if (found == Object.keys(productsInclude[key]).length && product.price >= minPrice && product.price <= maxPrice) {
//            productsToReturn.push(product);
//        }
//    }
//    else if (product.price >= minPrice && product.price <= maxPrice) {
//        productsToReturn.push(product);
//    }
//});