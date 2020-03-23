///**
// * Created by correnti on 21/11/2015.
// */
//
//define(['./module'], function (controllers) {
//    'use strict';
//    controllers.controller('productCtrl', ['$scope', 'resolveParams', '$state', '$filter',
//        '$rootScope', '$timeout',
//
//        function (s, resolveParams, $state, $filter, $rootScope, $timeout) {
//
//            s.pageState = resolveParams.pageState;
//            var resolveParams_selectedColor = resolveParams.selectedColor;
//
//            s.message = {};
//            s.quantity = resolveParams.quantity || 1;
//            s.categoryName = resolveParams.categoryName;
//            s.product = resolveParams.product;
//            s.mostPopularComments = resolveParams.mostPopularComments
//
//            s.haveInternet = resolveParams.haveInternet;
//
//            s.showVideo = s.product.productId == 22 || s.product.productId == 15 || s.product.productId == 16;
//            s.imageUrl = angular.copy(s.product.imageUrl);
//
//            s.getFirstImageUrl = function () {
//                s.imagesArray = $filter("getAllImagesByColor")(s.product.images, s.colorSelected, s.product.imageUrl);
//                s.imageUrl = s.imagesArray[0];
//                return s.imagesArray;
//            };
//
//            s.product_attributes = Helper.sortAttributesByName(s.product.attributes);
//
//            if (!resolveParams.selectedColor && s.product.colors.length > 0) {
//                var colors = Helper.sortArrayByColorName(s.product.colors);
//                s.colorSelected = colors[0];
//            }
//            else {
//                for (var i = 0; i < s.product.colors.length; i++) {
//                    if (s.product.colors[i].code == resolveParams.selectedColor) {
//                        s.colorSelected = s.product.colors[i];
//                        break;
//                    }
//                }
//            }
//
//            s.colorSelected = s.colorSelected || s.product.colors[0];
//            s.getFirstImageUrl();
//
//            s.addToCart = function (disable) {
//
//                if (disable) {
//                    return;
//                }
//
//                var productToAdd = angular.copy(s.product);
//                productToAdd.colors = [s.colorSelected];
//
//                if (s.pageState == 'edit') {
//                    s.$parent.updateProduct(productToAdd, s.colorSelected, s.quantity, resolveParams_selectedColor,
//                        $filter("translate")("toast_Product_Updated_Successfully")).then(function(res){
//                        if(res.message){
//                            s.message.text = res.message; //s._class = res.success ? "valid" : "invalid";
//                            if(_____productAdded){
//                                $timeout.cancel(_____productAdded);
//                            }
//                            _____productAdded = $timeout(function(){
//                                s.message.text = "";
//                                s.message._class = "";
//                                $state.go('shoppingCart');
//                            }, 2000);
//                        }
//                        else{
//                            $state.go('shoppingCart');
//                        }
//                    });
//                }
//                else {
//                    var quantity = s.quantity;
//
//                    var user = $rootScope.userCookie;
//                    if (!(user && user.response && user.response.userId != -1)) {
//                        for (var i = 0; i < s.$parent.cart.productsInCart.length; i++) {
//                            var prod = s.$parent.cart.productsInCart[i];
//                            if (prod.productId == productToAdd.productId && prod.color.code == s.colorSelected.code) {
//                                if (prod.quantity + quantity > s.product.colors[0].inStock) {
//                                    quantity = s.product.colors[0].inStock - prod.quantity;
//                                }
//                            }
//                        }
//                    }
//                    if (quantity > 0) {
//                        var request = s.$parent.addProduct(productToAdd, quantity, $filter("translate")("toast_Product_Added_Successfully"));
//                        request.then(function (res) {
//                            if(res.message){
//                                s.message.text = res.message; //s._class = res.success ? "valid" : "invalid";
//                                if(_____productAdded){
//                                    $timeout.cancel(_____productAdded);
//                                }
//                                _____productAdded = $timeout(function(){
//                                    s.message.text = "";
//                                    s.message._class = "";
//                                }, 4000);
//                            }
//                        });
//                    }
//                }
//            };
//            var _____productAdded;
//
//
//            s.changeImage = function (img) {
//                s.imageUrl = img;
//            };
//
//            s.setColor = function (color) {
//                s.imageUrl = s.product.imageUrl;
//                s.colorSelected = color;
//                s.getFirstImageUrl();
//            };
//
//            Helper.forAllPage();
//
//            console.log("resolveParams");
//            console.log(resolveParams);
//
//
//            s.nextReview = function(){
//                if(sliderIndex + 1 >= s.mostPopularComments.length){
//                    return;
//                }
//                sliderIndex++;
//                reviewGo();
//            };
//            s.previousReview = function(){
//                if(sliderIndex == 0){
//                    return;
//                }
//                sliderIndex--;
//                reviewGo();
//            };
//            function reviewGo(){
//                $timeout.cancel(slider_interval);
//                sliderHandler();
//            }
//            function reviewGotoNew(){
//                sliderIndex++;
//                sliderHandler();
//            }
//
//
//            var sliderIndex = 0;
//            var slider_interval;
//            reviewGo();
//            function sliderHandler(){
//
//                var left = sliderIndex < s.mostPopularComments.length ?
//                "-" + ($("#product_2 .reviews").width() * sliderIndex) : 0;
//
//                if(left == 0){ sliderIndex = 0; }
//
//                $("#product_2 .reviews .reviewsCover").css({ left: left + "px" });
//
//                $("#product_2 .reviews .rightArrow img").attr("src","../../css/images/review_right" +
//                    (sliderIndex + 1 < s.mostPopularComments.length ? "" : "_disabled") +".png")
//
//                $("#product_2 .reviews .leftArrow img").attr("src", "../../css/images/review_Left"
//                    + (sliderIndex == 0 ? "_disabled" : "") +".png")
//
//                if(document.location.hash.indexOf("/product/") != -1){
//                    slider_interval = $timeout(reviewGotoNew, 12000);
//                }
//            }
//        }]);
//});
//
//
//
//
//
///**
// * Created by correnti on 21/11/2015.
// */
//
//
//
///*
// var img = $("#imgToBuy").clone();
// var imgPoss = $("#imgToBuy").offset();
// var mainCartPossition = $("#mainCart").offset();
//
// img.css({
// "position" : "absolute",
// "top": imgPoss.top + "px",
// "left": imgPoss.left + "px",
// "display" : "none",
// })
// img.appendTo("#product-image");
// img.fadeIn(1000, function(){
// img.animate({
// top : mainCartPossition.top + 5,
// left : mainCartPossition.left + 10,
// width: 10,
// height: 10,
// opacity: 0.3
// }, 1000, function(){
// img.remove();
// //$rootScope.user.cart.laptops.push($scope.product) = get user
// });
// })
// */
/**
 * Created by correnti on 21/11/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('productCtrl', ['$scope', 'resolveParams', '$state', '$filter',
        '$rootScope', '$timeout', 'categoryService',

        function (s, resolveParams, $state, $filter, $rootScope, $timeout, categoryService) {

            s.pageState = resolveParams.pageState;
            var resolveParams_selectedColor = resolveParams.selectedColor;

            s.message = {};
            s.quantity = resolveParams.quantity || 1;
            s.categoryName = resolveParams.categoryName;
            s.product = resolveParams.product;
            s.mostPopularComments = [];

            s.haveInternet = resolveParams.haveInternet;

            s.showVideo = s.product.productId == 22 || s.product.productId == 15 || s.product.productId == 16;
            s.imageUrl = angular.copy(s.product.imageUrl);

            s.getFirstImageUrl = function () {
                s.imagesArray = $filter("getAllImagesByColor")(s.product.images, s.colorSelected, s.product.imageUrl);
                s.imageUrl = s.imagesArray[0];
                return s.imagesArray;
            };

            s.product_attributes = Helper.sortAttributesByName(s.product.attributes);

            if (!resolveParams.selectedColor && s.product.colors.length > 0) {
                var colors = Helper.sortArrayByColorName(s.product.colors);
                s.colorSelected = colors[0];
            }
            else {
                for (var i = 0; i < s.product.colors.length; i++) {
                    if (s.product.colors[i].code == resolveParams.selectedColor) {
                        s.colorSelected = s.product.colors[i];
                        break;
                    }
                }
            }

            s.colorSelected = s.colorSelected || s.product.colors[0];
            s.getFirstImageUrl();

            s.addToCart = function (disable) {

                if (disable) {
                    return;
                }

                var productToAdd = angular.copy(s.product);
                productToAdd.colors = [s.colorSelected];

                if (s.pageState == 'edit') {
                    s.$parent.updateProduct(productToAdd, s.colorSelected, s.quantity, resolveParams_selectedColor,
                        $filter("translate")("toast_Product_Updated_Successfully")).then(function(res){
                        if(res.message){
                            s.message.text = res.message; //s._class = res.success ? "valid" : "invalid";
                            if(_____productAdded){
                                $timeout.cancel(_____productAdded);
                            }
                            _____productAdded = $timeout(function(){
                                s.message.text = "";
                                s.message._class = "";
                                $state.go('shoppingCart');
                            }, 2000);
                        }
                        else{
                            $state.go('shoppingCart');
                        }
                    });
                }
                else {
                    var quantity = s.quantity;

                    var user = $rootScope.userCookie;
                    if (!(user && user.response && user.response.userId != -1)) {
                        for (var i = 0; i < s.$parent.cart.productsInCart.length; i++) {
                            var prod = s.$parent.cart.productsInCart[i];
                            if (prod.productId == productToAdd.productId && prod.color.code == s.colorSelected.code) {
                                if (prod.quantity + quantity > s.product.colors[0].inStock) {
                                    quantity = s.product.colors[0].inStock - prod.quantity;
                                }
                            }
                        }
                    }
                    if (quantity > 0) {
                        var request = s.$parent.addProduct(productToAdd, quantity, $filter("translate")("toast_Product_Added_Successfully"));
                        request.then(function (res) {
                            if(res.message){
                                s.message.text = res.message; //s._class = res.success ? "valid" : "invalid";
                                if(_____productAdded){
                                    $timeout.cancel(_____productAdded);
                                }
                                _____productAdded = $timeout(function(){
                                    s.message.text = "";
                                    s.message._class = "";
                                }, 4000);
                            }
                        });
                    }
                }
            };
            var _____productAdded;


            s.changeImage = function (img) {
                s.imageUrl = img;
            };

            s.setColor = function (color) {
                s.imageUrl = s.product.imageUrl;
                s.colorSelected = color;
                s.getFirstImageUrl();
            };

            Helper.forAllPage();

            s.nextReview = function(){
                if(sliderIndex + 1 >= s.mostPopularComments.length){
                    return;
                }
                sliderIndex++;
                reviewGo();
            };

            s.previousReview = function(){
                if(sliderIndex == 0){
                    return;
                }
                sliderIndex--;
                reviewGo();
            };

            function reviewGo(){
                $timeout.cancel(slider_interval);
                sliderHandler();
            }

            function reviewGotoNew(){
                sliderIndex++;
                sliderHandler();
            }


            var sliderIndex = 0;
            var slider_interval;

            function sliderHandler(){

                var left = sliderIndex < s.mostPopularComments.length ?
                "-" + ($("#product_2 .reviews").width() * sliderIndex) : 0;

                if(left == 0){ sliderIndex = 0; }

                $("#product_2 .reviews .reviewsCover").css({ left: left + "px" });

                $("#product_2 .reviews .rightArrow img").attr("src","../../css/images/review_right" +
                    (sliderIndex + 1 < s.mostPopularComments.length ? "" : "_disabled") +".png")

                $("#product_2 .reviews .leftArrow img").attr("src", "../../css/images/review_Left"
                    + (sliderIndex == 0 ? "_disabled" : "") +".png")

                if(document.location.hash.indexOf("/product/") != -1){
                    slider_interval = $timeout(reviewGotoNew, 12000);
                }
            }

            categoryService.getMostPopularComments(s.product.categoryId).then(function(res){
                s.mostPopularComments = res;
                reviewGo();
            });




        }]);





});



