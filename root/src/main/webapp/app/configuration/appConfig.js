/**
 * Created by kubany on 10/13/2015.
 */

define([], function () {

    function config($translateProvider, $stateProvider, $urlRouterProvider/*, $locationProvider*/) {

        $translateProvider.useSanitizeValueStrategy('escapeParameters');

        $translateProvider.translations('en', english);

        $urlRouterProvider.otherwise("/#");

        //$locationProvider.html5Mode(true).hashPrefix("#");

        $translateProvider.preferredLanguage('en');

        $stateProvider.state('default', {
                url: '/',
                templateUrl: 'app/views/home-page.html',
                controller: 'categoriesCtrl',
                resolve: {

                    resolveParams: function (userService, categoryService, dealService, $q) {
                        var defer = $q.defer();

                        userService.haveConfiguration().then(function(){
                            categoryService.getCategories().then(function (categories) {
                                dealService.getDealOfTheDay().then(function (deal) {
                                    categoryService.getPopularProducts().then(function (popularProducts) {
                                        categoryService.nvHandler().then(function () {
                                            var paramsToReturn = {
                                                categories: categories,
                                                specialOffer: deal,
                                                popularProducts: popularProducts,
                                            }
                                            defer.resolve(paramsToReturn)
                                        })
                                    })
                                });
                            });
                        });
                        return defer.promise;
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/user/views/register-page.html',
                controller: 'registerCtrl',
                resolve: {}
            }).
            state('support', {
                url: '/support',
                templateUrl: 'app/views/support-page.html',
                controller: 'supportCtrl',
                controllerAs: 'suppCtrl',
                resolve: {
                    paramsToResorve: function (categoryService, $q) {
                        var defer = $q.defer()
                        categoryService.getCategories().then(function (categories) {
                            defer.resolve({
                                categories: categories,
                            });
                        });
                        return defer.promise;
                    }
                }
            })
            .state('shoppingCart', {
                url: '/shoppingCart',
                templateUrl: 'app/views/shoppingCart.html',
                controller: 'shoppingCartCtrl',
                resolve: {
                    category: function (productsCartService, $stateParams) {
                        return productsCartService.loadCartProducts();
                    }
                }
            })
            .state('category', {
                url: '/category/:id?viewAll',
                templateUrl: 'app/views/category-page.html',
                controller: 'categoryCtrl',
                resolve: {
                    category: function (categoryService, productService,
                                        $stateParams, $q, userService) {
                        var defer = $q.defer();
                        categoryService.getCategoryById($stateParams.id).
                        then(function (category) {
                            productService.getAllCategoriesAttributes()
                                .then(function (attributes) {

                                    if(userService.nv_slowPage()){
                                        categoryService.getCategories()
                                            .then(function(){
                                            categoryService.nv_loadUnuseScripts()
                                                .then(function(){
                                                    defer.resolve({
                                                        attributes: attributes,
                                                        searchResult: [category],
                                                        categoryName: category.categoryName
                                                    });
                                                });
                                        });
                                    }
                                    else{
                                        defer.resolve({
                                            attributes: attributes,
                                            searchResult: [category],
                                            categoryName: category.categoryName
                                        });
                                    }

                            });
                        });
                        return defer.promise;
                    },
                }
            })
            .state('search', {
                url: '/search/:id?viewAll',
                templateUrl: 'app/views/search-page.html',
                controller: 'searchCtrl',
                resolve: {
                    category: function (categoryService, productService, $stateParams, $q, $filter) {
                        var defer = $q.defer();
                        productService.getProductsBySearch($stateParams.viewAll, -1).then(function (result) {
                            var categoriesFilter = $filter("getCategoriesInArray")([], result, $stateParams.id)
                            var paramsToReturn = {
                                searchResult: result,
                                viewAll: true,
                                categoryId: 1,
                                searchKey: $stateParams.viewAll,
                                categoriesFilter: categoriesFilter,
                                attributes: [],
                            }
                            defer.resolve(paramsToReturn);
                        });
                        return defer.promise;
                    },
                }
            })
            //.state('product', {
            //    url: '/product/:id?color&quantity&pageState',
            //    templateUrl: 'app/views/product-page.html',
            //    controller: 'productCtrl',
            //    resolve: {
            //        resolveParams: function (productService, categoryService, $stateParams, $q) {
            //            var defer = $q.defer();
            //            productService.getProductById($stateParams.id).then(function (product) {
            //
            //                $q.all([categoryService.getCategoryById(product.categoryId),
            //                        categoryService.haveInternet(product.categoryId),
            //                        categoryService.getMostPopularComments(product.categoryId),
            //                ])
            //                    .then(function (res) {
            //
            //                    var category = res[0];
            //                    var haveInternet = res[1];
            //                    var mostPopularComments = res[2];
            //
            //                    var paramsToReturn = {
            //                        selectedColor: $stateParams.color,
            //                        quantity: $stateParams.quantity,
            //                        pageState: $stateParams.pageState,
            //                        categoryName: category.categoryName,
            //                        product: product,
            //                        haveInternet: haveInternet,
            //                        mostPopularComments: mostPopularComments
            //                    }
            //                    defer.resolve(paramsToReturn)
            //                });
            //            });
            //            return defer.promise;
            //        }
            //    }
            //}).

            .state('product', {
                url: '/product/:id?color&quantity&pageState',
                templateUrl: 'app/views/product-page.html',
                controller: 'productCtrl',
                resolve: {
                    resolveParams: function (productService, categoryService, $stateParams, $q) {
                        var defer = $q.defer();
                        productService.getProductById($stateParams.id).then(function (product) {

                            $q.all([categoryService.getCategoryById(product.categoryId),
                                    categoryService.haveInternet(product.categoryId),
                            ])
                                .then(function (res) {

                                var category = res[0];
                                var haveInternet = res[1];

                                    var paramsToReturn = {
                                        selectedColor: $stateParams.color,
                                        quantity: $stateParams.quantity,
                                        pageState: $stateParams.pageState,
                                        categoryName: category.categoryName,
                                        product: product,
                                        haveInternet: haveInternet,
                                    }
                                    defer.resolve(paramsToReturn)
                                });
                        });
                        return defer.promise;
                    }
                }
            }).
        state('404', {
            url: '/404',
            templateUrl: 'app/views/404.html',
        });
    }

    config.$inject = ['$translateProvider', '$stateProvider', '$urlRouterProvider'];
    return config;

});

