/**
 * Created by correnti on 07/12/2015.
 */

define(['./module'], function (directives) {
    'use strict';

    directives.directive('search', ['$templateCache', 'productService', '$location', '$state',
            function ($templateCache, productService, $location, $state) {
                return {
                    restrict: 'E',
                    controller: ['$scope', function (s) {

                        s.categoryFilter = null;
                        s.categoryName = '';
                        s.allowClosing = true;
                        s.checkEnterKey = function (event) {
                            if (event.which === 13) {
                                s.goToCategoryPage();
                            }
                        }

                        var lastRequest = '';
                        s.runAutocomplete = function () {
                            lastRequest = s.autoCompleteValue;
                            if (lastRequest == '') {
                                s.autoCompleteResult = {};
                                return;
                            }
                            productService.getProductsBySearch(lastRequest, 10).then(function (result) {
                                s.autoCompleteResult = result;
                            });
                        }

                        s.goToCategoryPage = function () {
                            $state.go('search', {
                                id: (s.categoryFilter == null ? '' : s.categoryFilter),
                                viewAll: s.autoCompleteValue
                            });
                        }

                        s.openSearchProducts = function () {

                            var navsLinks = $("nav ul li a.navLinks");
                            navsLinks.each(function (index) {
                                setTimeout(function (_this) {
                                    $(_this).stop().animate({opacity: 0.1}, 500);
                                }, 200 * index, this);
                            });

                            setTimeout(function (navsLinks) {
                                navsLinks.hide();
                                $('#searchSection .autoCompleteCover').stop().animate({
                                    width: getAutocompleateWidth() + "px",
                                    margin: '0 6px'
                                }, 500).animate({
                                    opacity: 1
                                }, 200, function () {
                                    $('#autoComplete').focus();
                                });
                                $('#searchSection .autoCompleteCover .iconCss.iconX').fadeIn(300);
                            }, (200 * navsLinks.length), navsLinks);
                        }

                        s.closeSearchForce = function () {

                            $('#searchSection .autoCompleteCover .iconCss.iconX').fadeOut(300);
                            setTimeout(function () {
                                $('#searchSection .autoCompleteCover')
                                    .animate({
                                        width: 0 + "px",
                                        opacity: 0.5,
                                        margin: '0 0'
                                    }, 500, function () {
                                        if ($location.path() == '/') {
                                            var navsLinks = $("nav ul li a.navLinks");
                                            navsLinks.show();
                                            navsLinks.each(function (index) {
                                                setTimeout(function (_this) {
                                                    $(_this).stop().animate({opacity: 1}, 100);
                                                }, 100 * index, this);
                                            });
                                        }
                                    });
                            }, 400);

                            s.autoCompleteValue = lastRequest = '';
                            s.autoCompleteResult = {};
                        }

                        s.closeSearchSection = function () {
                            if (!s.allowClosing /*|| $location.path().indexOf('/search') != -1*/) {
                                return;
                            }
                            s.closeSearchForce();
                        }

                        s.allowClosingLeave = function () {
                            $('#autoComplete').focus();
                            s.allowClosing = true;
                        }

                        $(document).ready(function () {
                            $(window).resize(function () {
                                if ($("#searchSection").width() > 150) {
                                    $('#searchSection .autoCompleteCover').width(getAutocompleateWidth());
                                }
                            });
                        });

                        function getAutocompleateWidth() {
                            return ($(document).width() > 1000 ? 680 :
                                    $(document).width() > 1000 ? 530 : 300) -
                                ($(".hi-user").width() * 1.5);
                        }

                        $('#product_search_img').click(function (e) {
                            $('#product_search').css("display", "inline-block");
                            $('#product_search').animate({"width": $('#product_search').width() > 0 ? 0 : "150px"},
                                500, function () {
                                    if ($('#product_search').width() == 0) {
                                        $(this).css("display", "none");
                                    }
                                });
                        });

                        s.searchByCategoryId = function (id, categoryName) {
                            console.log(id);
                            s.categoryFilter = id;
                            s.categoryName = categoryName;
                        }

                    }]
                };
            }])
        .directive('toolTipSearch', ['$templateCache', 'productService', '$location', '$state',
            function ($templateCache) {
                return {
                    restrict: 'A',
                    replace: true,
                    required: "search",
                    template: $templateCache.get('app/partials/toolTipSearch.html'),
                };
            }])
        .directive('mobileSearch', ['$templateCache', 'productService', '$location', '$state',
            function ($templateCache) {
                return {
                    restrict: 'A',
                    replace: true,
                    required: "search",
                    template: $templateCache.get('app/partials/mobileSearch.html'),
                };
            }])
});

