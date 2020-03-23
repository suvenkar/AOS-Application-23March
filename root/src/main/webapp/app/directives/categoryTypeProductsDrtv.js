/**
 * Created by kubany on 10/29/2015.
 */

define(['./module'], function (directives) {
    'use strict';
    directives.directive('categoryTypeProductsDrtv', ['$filter', '$animate', '$templateCache',
        '$location', function ($filter, $animate, $templateCache, $location) {
            return {
                restrict: 'EA',
                replace: 'true',
                template: $templateCache.get('app/partials/category_type_products_tpl.html'),
                scope: {
                    paramsToPass: '=',
                },
                link: function (s, element, attrs) {

                    var slider;
                    s.showClear = false;
                    s.productsInclude = [];
                    s.minPriceToFilter = 0;
                    s.maxPriceToFilter = 0;
                    s.categoriesFilter = s.paramsToPass.categoriesFilter;
                    s.searchResult = s.paramsToPass.searchResult;
                    s.viewAll = s.paramsToPass.viewAll;
                    s.$location = $location;

                    for (var index in s.categoriesFilter) {
                        var category = s.categoriesFilter[index];
                        if (category.checked) {
                            if (s.productsInclude["CATEGORIES"] == undefined) {
                                s.productsInclude["CATEGORIES"] = [];
                            }
                            s.productsInclude["CATEGORIES"].push(category.id);
                        }
                    }

                    s.options = {start: [20, 70], range: {min: 0, max: 100}}

                    s.toggleColorSelectedClass = function (code) {
                        $("#productsColors" + code).toggleClass('colorSelected');
                    }

                    s.toggleFilterSlide = function (id) {
                        $("#" + id).slideToggle();
                    }


                    s.includeProducts = function (attributeVal, attributesName) {

                        if (!attributeVal) return;

                        var location = $.inArray(attributeVal, s.productsInclude[attributesName]);
                        if (location > -1) {
                            s.productsInclude[attributesName].splice(location, 1);
                            if (s.productsInclude[attributesName].length == 0) {
                                delete s.productsInclude[attributesName];
                            }
                        }
                        else {
                            if (s.productsInclude[attributesName] == undefined) {
                                s.productsInclude[attributesName] = [];
                            }
                            s.productsInclude[attributesName].push(attributeVal);
                        }

                        s.showClear =
                            Object.keys(s.productsInclude).length > 0 ||
                            slider.noUiSlider.start != s.minPriceToFilter ||
                            slider.noUiSlider.end != s.maxPriceToFilter;

                        s.productToShow = $filter("productsFilterForCategoriesProduct")
                        ([], s.searchResult, s.minPriceToFilter, s.maxPriceToFilter)

                    }

                    s.clearSelection = function () {

                        for (var key in s.productsInclude) {
                            delete s.productsInclude[key];
                        }

                        $('.option input[type=checkbox]').each(function () {
                            this.checked = false;
                        })

                        $('.option .productColor').removeClass('colorSelected');

                        slider.noUiSlider.set([slider.noUiSlider.start, slider.noUiSlider.end]);

                        s.showClear = false;

                    };

                    s.toggleColapse = function (id) {
                        $('#' + id).siblings('.option').slideToggle(300);
                        $('#' + id).toggleClass('arrowUp');
                    }


                    configSlider();

                    s.productToShow = $filter("productsFilterForCategoriesProduct")([], s.searchResult, s.minPriceToFilter, s.maxPriceToFilter)

                    s.attributesToShow = getAttributesToShow(s.productToShow, s.paramsToPass.attributes.categoriesAttributes);

                    s.productsColors = getColorsInProducts(s.productToShow);


                    function getFormat(categoryId, attributeName) {
                        return "(categoryId_" + categoryId + "-attributeName__" + attributeName + ")";
                    }

                    function getAttributesToShow(productToShow, attrFilter) {

                        /*Build long String to search showInFilter param*/
                        var attributes = [];
                        var attrShowInFilter = "";
                        angular.forEach(attrFilter, function (attr) {
                            if (attr.showInFilter) {
                                attrShowInFilter += getFormat(attr.categoryId, attr.attributeName);
                            }
                        });

                        /*filtering showInFilter param*/
                        for (var index in productToShow) {

                            var prod = productToShow[index];
                            for (var categIndex in prod.attributes) {
                                var categ = prod.attributes[categIndex];
                                if (attrShowInFilter.indexOf(getFormat(prod.categoryId, categ.attributeName)) != -1) {
                                    if (attributes[categ.attributeName] == undefined) {
                                        attributes[categ.attributeName] = [];
                                    }
                                    attributes[categ.attributeName].push(categ.attributeValue)
                                }
                            }
                        }

                        /*filtering repeated parameters*/
                        for (var index in attributes) {
                            attributes[index] = attributes[index].filter(
                                function (val, index, arr) {
                                    return arr.indexOf(val) == index;
                                });
                        }


                        /* Sorting attributes in atrributes by abc */
                        for (var name in attributes) {
                            attributes[name] = Helper.sortArrayByAbc(attributes[name]);
                        }


                        //users


                        /* Builder attributes to show */
                        var attributesToShow = [];
                        for (var name in attributes) {
                            if (Object.keys(attributes[name]).length <= 1) {
                                continue;
                            }
                            attributesToShow.push({
                                name: name,
                                values: [],
                            });
                            for (var index in attributes[name]) {
                                attributesToShow[attributesToShow.length - 1].values.push(attributes[name][index]);
                            }
                        }
                        return attributesToShow;
                    }


                    function getColorsInProducts(products) {
                        var productsColors = [];
                        angular.forEach(products, function (product) {
                            angular.forEach(product.colors, function (color) {
                                var find = false;
                                angular.forEach(productsColors, function (productColor) {
                                    if (productColor.code == color.code) {
                                        find = true;
                                    }
                                });
                                if (!find) {
                                    productsColors.push(color)
                                }
                            });
                        });

                        return Helper.sortArrayByColorName(productsColors);
                    }


                    function configSlider() {

                        var maxVal;
                        var minVal = 900000;
                        angular.forEach(s.searchResult, function (category) {

                            var products = category.products
                            angular.forEach(products, function (product) {
                                if (product.price < minVal) {
                                    minVal = product.price;
                                    if (!maxVal) {
                                        maxVal = product.price
                                    }
                                }
                                else if (product.price > maxVal) {
                                    maxVal = product.price;
                                }
                            });

                        });

                        s.minPriceToFilter = Math.round(minVal) - 1;
                        s.maxPriceToFilter = Math.round(maxVal || 999999);

                        slider = document.getElementById('slider');
                        var step = s.maxPriceToFilter - s.minPriceToFilter;
                        step = step < 100 ? 5 : 100;
                        noUiSlider.create(slider, {
                            start: [s.minPriceToFilter, s.maxPriceToFilter],
                            connect: true,
                            range: {
                                'min': s.minPriceToFilter,
                                'max': s.maxPriceToFilter,
                            },
                            step: 1, //step < 100 ? 100 : Math.round(step / 100) - 1,
                            margin: step,  //Math.round(step / 100) - 1,
                        });
                        slider.noUiSlider.start = s.minPriceToFilter;
                        slider.noUiSlider.end = s.maxPriceToFilter;

                        slider.noUiSlider.on('update', function (values, handle) {
                            s.$applyAsync(function () {
                                if (handle == '0') {
                                    s.minPriceToFilter = parseInt(values[handle]) + (step + 2) >= s.maxPriceToFilter ? s.maxPriceToFilter : values[handle];
                                } else {
                                    s.maxPriceToFilter = parseInt(values[handle]) - (step + 2) <= s.minPriceToFilter ? s.minPriceToFilter : values[handle];
                                }
                                s.showClear =
                                    Object.keys(s.productsInclude).length > 0 ||
                                    slider.noUiSlider.start != s.minPriceToFilter ||
                                    slider.noUiSlider.end != s.maxPriceToFilter;
                            });
                        });
                    }


                }
            };
        }])
});

