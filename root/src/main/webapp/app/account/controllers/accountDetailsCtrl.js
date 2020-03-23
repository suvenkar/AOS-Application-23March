/**
 * Created by correnti on 31/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('accountDetailsCtrl', ['$scope', '$timeout',
        '$location', 'resolveParams', 'registerService', 'accountService',
        function (s, $timeout, $location, resolveParams, registerService, accountService) {

            checkLogin();
            function checkLogin() {
                s.checkLogin();
                if ($location.path().indexOf('/accountDetails') != -1) {
                    $timeout(checkLogin, 2000);
                }
            }

            s.accountDetails = resolveParams.accountDetails;
            s.accountDetailsAnswer = {message: '', class: 'invalid'}
            s.saveAccountDetails = function () {

                s.accountDetails.countryId = s.country.id;
                s.accountDetails.countryIsoName = s.country.isoName;
                s.accountDetails.countryName = s.country.name;
                accountService.changeUserPassword(s.accountDetails.id, s.passwords)
                    .then(function (changeUserPasswordRes) {
                        if (changeUserPasswordRes && changeUserPasswordRes.success) {
                            accountService.accountUpdate(s.accountDetails).then(function (response) {
                                if (response && response.reason) {
                                    s.accountDetailsAnswer = {
                                        message: response.reason,
                                            class: response.success ? 'valid' : 'invalid'
                                    }
                                    if (response.success) {
                                        $location.path('myAccount');
                                    }
                                    else {
                                        $timeout(function () {
                                            s.accountDetailsAnswer = {message: '', class: 'invalid'}
                                        }, 4000);
                                    }
                                }
                            });
                        }
                        else {
                            s.accountDetailsAnswer = {
                                class: 'invalid',
                                message: changeUserPasswordRes.reason,
                            }
                            $timeout(function () {
                                s.accountDetailsAnswer = {message: '', class: 'invalid'}
                            }, 4000);
                        }
                    });
            }

            s.countries = null;
            registerService.getAllCountries().then(function (countries) {
                for (var i  in countries) {
                    if (countries[i].id == s.accountDetails.countryId) {
                        s.country = countries[i];
                        break;
                    }
                }
                s.countries = countries;
            });

            s.passwords = {
                new: '',
                old: '',
                confirm_new: '',
            }

            s.slideToggle = function (id) {
                $("#" + id + ", ." + id).slideToggle();
            }

            Helper.forAllPage();

        }]);
});




