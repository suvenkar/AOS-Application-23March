/**
 * Created by correnti on 10/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('productsCartSum', ["userService", function(userService){
        return function(cart, plus) {
            var count = 0;
            var increment = plus || 0;
            if(cart) {
                angular.forEach(cart.productsInCart, function (product) {
                    count += (product.price * product.quantity);
                })
            }
            var cartIncrement = userService.getCartIncrement();
            return parseFloat(increment) + count + cartIncrement;
        };
    }]).
    filter('secCatWord', function(){
        return function(text, maxLength) {
            if(text.length > maxLength){
                text = text.substring(0, maxLength - 3) + "...";
            }
            return text;
        };
    })
    ;
});

