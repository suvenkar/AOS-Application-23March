/**
 * Created by correnti on 06/12/2015.
 */

define(['./module'], function (services) {
    'use strict';
    services.service('productsCartService', ['$http', '$q', 'resHandleService', 'ipCookie',
        '$rootScope',
        function ($http, $q, responseService, $cookie, $rootScope) {

            var cart = null;

            function getTempCart() {
                return {"userId": -1, "productsInCart": [],}
            }

            return ({
                addProduct: addProduct,
                updateProduct: updateProduct,
                loadCartProducts: loadCartProducts,
                joinCartProducts: joinCartProducts,
                removeProduct: removeProduct,
                checkout: checkout,
                getCart: getCart,
                saveCart: saveCart,
                clearCart: clearCart,
                checkOutOfStockProductsInCart: checkOutOfStockProductsInCart,
            });

            /* returned functions */

            function clearCart() {
                var responce = $q.defer();
                var user = $rootScope.userCookie;
                if (user && user.response) {
                    if (user.response.userId != -1) {
                        $http({
                            method: "delete",
                            headers: {
                                "content-type": "application/json; charset=utf-8",
                                "Authorization": "Basic " + user.response.t_authorization,
                            },
                            url: server.order.clearCart(user.response.userId)
                        }).success(function (res) {
                            cart = res;
                            Loger.Received(res)
                            responce.resolve(cart);
                        }).error(function (err) {
                            alert('An error occurred, please try again')
                            Loger.Received(err);
                            responce.reject('error in load cart (productCartService - loadCartProducts)');
                        });
                    }
                }
                else {
                    responce.resolve(null);
                }
                return responce.promise;
            }

            function saveCart(_cart) {
                updateCart(_cart);
            }

            function getCart() {

                var responce = $q.defer();
                var user = $rootScope.userCookie;
                if (user && user.response) {
                    if (user.response.userId != -1) {
                        $http({
                            method: "get",
                            async: false,
                            headers: {
                                "content-type": "application/json; charset=utf-8",
                                "Authorization": "Basic " + user.response.t_authorization,
                            },
                            url: server.order.loadCartProducts(user.response.userId)
                        }).success(function (res) {
                            Loger.Received(res)
                            cart = res;
                            responce.resolve(cart);
                        }).error(function (err) {
                            alert('An error occurred, please try again')
                            Loger.Received(err)
                            responce.reject('error in load cart (productCartService - loadCartProducts)');
                        });
                    }
                }
                else {
                    responce.resolve(null);
                }
                return responce.promise;
            }

            function checkout() {
                var responce = $q.defer();
                responce.resolve(false);
                return responce.promise;
            }

            function removeProduct(index) {
                var responce = $q.defer();
                var user = $rootScope.userCookie;
                var prod = cart.productsInCart[index];
                cart.productsInCart.splice(index, 1);
                if (user && user.response && user.response.userId != -1) {
                    Loger.Received("deleted product, no returns!");
                    $http({
                        method: "delete",
                        url: server.order.removeProductToUser(user.response.userId, prod.productId, prod.color.code),
                        headers: {
                            "content-type": "application/json; charset=utf-8",
                            "Authorization": "Basic " + user.response.t_authorization,
                        }
                    });
                }
                else {
                    updateCart(cart);
                }
                responce.resolve(cart);
                return responce.promise;
            }

            function loadCartProducts() {

                var responce = $q.defer();
                var user = $rootScope.userCookie;
                if (user && user.response) {
                    if (user.response.userId != -1) {
                        $http({
                            method: "get",
                            async: false,
                            headers: {
                                "content-type": "application/json; charset=utf-8",
                                "Authorization": "Basic " + user.response.t_authorization,
                            },
                            url: server.order.loadCartProducts(user.response.userId)
                        }).success(function (res) {
                            Loger.Received(res)
                            cart = res;
                            responce.resolve(cart);
                        }).error(function (err) {
                            Loger.Received(err)
                            alert('An error occurred, please try again')
                            responce.reject('error in load cart (productCartService - loadCartProducts)');
                        });
                    }
                }
                else {
                    cart = loadGuestCartProducts();
                    responce.resolve(cart);
                }
                return responce.promise;
            }

            function loadGuestCartProducts() {

                var guestCart = $cookie("userCart");
                if (!guestCart) {
                    guestCart = getTempCart();
                    updateCart(guestCart);
                }
                return guestCart;
            }

            function joinCartProducts() {

                var defer = $q.defer();
                loadCartProducts().then(function (_cart) {
                    cart = _cart;
                    var guestCart = loadGuestCartProducts();

                    var tempCart = [];
                    angular.forEach(cart.productsInCart, function (userProduct) {
                        var find = false;
                        angular.forEach(guestCart.productsInCart, function (guestProduct) {
                            if (userProduct.productId == guestProduct.productId && userProduct.color.code == guestProduct.color.code) {
                                find = true;
                            }
                        });
                        if (!find) {
                            tempCart.push(userProduct);
                        }
                    });
                    angular.forEach(guestCart.productsInCart, function (guestProduct) {
                        tempCart.push(guestProduct);
                    });

                    cart.productsInCart = tempCart;
                    updateUserCart(cart);
                    $cookie.remove("userCart");
                    defer.resolve(cart);
                })
                return defer.promise;
            }


            function updateUserCart() {

                var user = $rootScope.userCookie;
                if (user && user.response) {
                    if (user.response.userId != -1) {

                        var cartToReplace = [];
                        angular.forEach(cart.productsInCart, function (product) {
                            cartToReplace.push({
                                "hexColor": product.color.code,
                                "productId": product.productId,
                                "quantity": product.quantity,
                            });
                        })
                        if (cartToReplace.length > 0) {
                            $http({
                                method: "put",
                                data: JSON.stringify(cartToReplace),
                                headers: {
                                    "Authorization": "Basic " + user.response.t_authorization,
                                },
                                url: server.order.updateUserCart(user.response.userId)
                            }).success(function (res) {
                                Loger.Received(res);
                                console.log(res);
                            }).error(function (_err) {
                                Loger.Received(_err);
                                console.log("updateUserCart() rejected!  ====== " + _err)
                            });
                        }
                    }
                }
            }

            function updateCart(guestCart) {
                $cookie("userCart", guestCart, {expires: 365 * 5});
            }

            function updateProduct(product, color, quantity, oldColor) {
                var response = $q.defer();
                var user = $rootScope.userCookie;
                if (product.colors) {
                    if (user && user.response) {
                        if (user.response.userId != -1) {

                            var request = $http({
                                method: "put",
                                headers: {
                                    "Authorization": "Basic " + user.response.t_authorization,
                                },
                                async: false,
                                url: server.order.updateProductToUser(user.response.userId,
                                    product.productId, product.colors[0].code, quantity, oldColor),
                            });
                            request.then(function (newCart) {
                                Loger.Received(newCart);
                                cart = newCart.data;
                                response.resolve(cart);
                            });
                            return response.promise;
                        }
                    }
                    else {
                        var productIndex = -1;
                        for (var index in cart.productsInCart) {
                            var productInCart = cart.productsInCart[index];
                            if (product.productId == productInCart.productId && productInCart.color.code == oldColor) {
                                productIndex = index;
                                if (color.code == oldColor) {
                                    productInCart.quantity = quantity;
                                }
                                else {
                                    var founded = false;
                                    for (var _index in cart.productsInCart) {
                                        var _productInCart = cart.productsInCart[_index];
                                        if (product.productId == _productInCart.productId) {
                                            if (_productInCart.color.code == color.code) {
                                                founded = true;
                                                var instock = product.colors[0].inStock;
                                                _productInCart.quantity = _productInCart.quantity + quantity >  instock ? instock : _productInCart.quantity + quantity;
                                                break;
                                            }
                                        }
                                    }
                                    if (founded) {
                                        cart.productsInCart.splice(productIndex, 1);
                                    }
                                    else {
                                        productInCart.color = color
                                        productInCart.quantity = quantity
                                    }
                                }
                                break;
                            }
                            else {
                                var sameProductIdCount = 0;
                                for (var _index in cart.productsInCart) {
                                    var _productInCart = cart.productsInCart[_index];
                                    if (product.productId == _productInCart.productId) {
                                        sameProductIdCount++;
                                    }
                                }
                                if (sameProductIdCount == 1) {
                                    productInCart.color = color
                                    productInCart.quantity = quantity
                                    break;
                                }
                            }
                        }
                        updateCart(cart);
                        response.resolve(cart);
                    }
                }
                return response.promise;
            }

            function addProduct(product, quantity) {

                var response = $q.defer();
                var user = $rootScope.userCookie;

                if (user && user.response) {
                    if (user.response.userId != -1) {

                        Helper.enableLoader();
                        var request = $http({
                            method: "post",
                            headers: {
                                "Authorization": "Basic " + user.response.t_authorization,
                            },
                            data: {},
                            async: false,
                            url: server.order.addProductToUser(user.response.userId,
                                product.productId, product.colors[0].code, quantity),
                        });
                        request.then(function (newCart) {
                            Helper.disableLoader();
                            Loger.Received(newCart);
                            cart = newCart.data;
                            response.resolve(cart);
                        });

                        return response.promise;
                    }
                }
                else {
                    var find = null;
                    var productIndex = 0;
                    angular.forEach(cart.productsInCart, function (productInCart, index) {
                        if (product.productId == productInCart.productId) {
                            angular.forEach(product.colors, function (color) {
                                if (productInCart.color.code == color.code) {
                                    productIndex = index;
                                    productInCart.quantity += quantity;
                                    find = product;
                                }
                            });
                        }
                    });

                    if (!find) {
                        cart.productsInCart.unshift({
                            "productId": product.productId,
                            "imageUrl": product.imageUrl,
                            "productName": product.productName,
                            "color": product.colors.length > 0 ? product.colors[0] : 'FFF',
                            "quantity": quantity,
                            "price": product.price
                        });
                    }
                    else {
                        cart.productsInCart.splice(0, 0, cart.productsInCart.splice(productIndex, 1)[0]);
                    }

                    updateCart(cart);
                    response.resolve(cart);
                    return response.promise;
                }
            }

            function checkOutOfStockProductsInCart() {

                var defer = $q.defer()

                var user = $rootScope.userCookie;
                if (user && user.response && user.response.userId != -1) {
                    defer.resolve(cart);
                    return defer.promise;
                }

                var cartToReplace = [];

                for (var prodIndex = 0; prodIndex < cart.productsInCart.length; prodIndex++) {
                    var product = cart.productsInCart[prodIndex];
                    checkOutOfStockProduct(product, prodIndex).then(function (res) {

                        if (res._prod != null) {
                            cartToReplace.push(res.real_prod);
                        }

                        if (res._prodIndex == cart.productsInCart.length - 1) {
                            cart.productsInCart = cartToReplace;
                            updateCart(cart);
                            defer.resolve(cart);
                        }
                    });
                }
                if (cart.productsInCart.length == 0) {
                    defer.resolve(cart);
                }
                return defer.promise;
            }

            function checkOutOfStockProduct(product, prodIndex) {

                var defer = $q.defer()
                $http({
                    method: "get",
                    url: server.catalog.getProductById(product.productId)
                }).success(function (res) {
                    Loger.Received(res);
                    defer.resolve(res.productStatus == 'OutOfStock' ?
                    {real_prod: product, _prod: null, _prodIndex: prodIndex} :
                    {real_prod: product, _prod: res, _prodIndex: prodIndex});
                }).error(function (_err) {
                    Loger.Received(_err);
                    console.log("checkOutOfStockProduct() rejected!  ====== " + _err)
                    console.log(_err)
                    defer.resolve({real_prod: product, _prod: res, _prodIndex: prodIndex});
                });
                return defer.promise;

            }

        }]);


});