/**
 * Created by correnti on 29/11/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('registerCtrl', ['$scope', 'registerService', '$location',
        '$timeout', '$filter', '$state',
        function (s, registerService, $location, $timeout, $filter, $state) {


            s.registerSuccess = false;
            s.WellcomeName = "";

            s.countries = {};
            s.registerAnswer = {
                message: '',
                class: 'invalid'
            }

            registerService.getAllCountries().then(function (countries) {
                s.countries = countries;
            });

            s.model = {
                username: '', email: '', password: '', confirm_password: '',
                firstName: '', lastName: '', phoneNumber: '', country: {}, address: '',
                city: '', postalCode: '', state: '', offers_promotion: true,
            }


            s.register = function () {

                registerService.register(s.model).then(function (response) {

                    s.registerAnswer.message = response.reason || $filter('translate')('register_faild');
                    s.registerAnswer.class = response.success ? 'valid' : 'invalid';

                    if (response.success) {
                        $('body, html').animate({scrollTop: 0}, 10);
                        s.WellcomeName = s.model.firstName.replace(/\s/g, "").length > 0 ? s.model.firstName :
                            s.model.lastName.replace(/\s/g, "").length > 0 ? s.model.lastName : s.model.username;

                        var user = {
                            email: s.model.email,
                            loginPassword: s.model.password,
                            loginUser: s.model.username,
                        };

                        s.signIn(user, false);
                        if(document.location.hash == "#/register"){
                            window.history.back();
                        }

                    }
                    else {
                        $timeout(function () {
                            s.registerAnswer.message = "";
                            s.registerAnswer.class = "";
                        }, 5000)
                    }
                }, function (err) {
                    console.log(err);
                    s.registerAnswer.message = $filter('translate')('register_faild');
                    s.registerAnswer.class = 'invalid';
                    $timeout(function () {
                        s.registerAnswer.message = "";
                        s.registerAnswer.class = "";
                    }, 5000)
                });
            }

            s.validForm  = false;
            s.isValidForm = function(valid){
                s.validForm  = valid;
            }

            $(document).on("keydown", function (event) {
                if (event.keyCode == 13 && s.validForm) {
                    s.register();
                    return false;
                }
            });

            Helper.forAllPage();

        }]);

});