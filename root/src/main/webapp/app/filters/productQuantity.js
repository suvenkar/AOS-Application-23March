/**
 * Created by correnti on 10/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('productQuantity', function(){
        return function(_array, quantity) {
            if(quantity > 9 && _array.length == 9)
            {
                for(var i = _array.length + 1; i <= quantity; i++)
                {
                    _array.push(i);
                }
            }
            return _array;
        };
    });
});

