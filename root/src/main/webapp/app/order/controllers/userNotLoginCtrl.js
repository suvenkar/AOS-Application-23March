/**
 * Created by correnti on 25/01/2016.
 */


define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('userNotLoginCtrl', ['$scope', '$state',
        function (s, $state) {

            s.checkCart();

            Helper.forAllPage();

            s.orderPaymenLogin = {
                loginUser : '',
                loginPassword : '',
                email : '',
            };

            s.orderPaymenLogin_signIn = function(){
                s.signIn(s.orderPaymenLogin, false);
            }

            s.$watch("userCookie.response", function(user){
                if(user && user.userId){
                    $state.go('orderPayment')
                }
            })
        }]);
});




