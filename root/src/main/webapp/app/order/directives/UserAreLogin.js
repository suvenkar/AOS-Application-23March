/**
 * Created by correnti on 03/01/2016.
 */


define(['./module'], function (directives) {
    'use strict';
    directives.directive('userAreLogin', ['$rootScope', '$templateCache', 'orderService',
        'registerService', '$timeout', 'accountService',
        function (rs, $templateCache, orderService, registerService, $timeout, accountService) {
            return {
                replace: true,
                template: $templateCache.get('app/order/partials/user-are-login.html'),
                link: {
                    pre: function (s) {
                        s.userDetailsEditMode = false;
                        s.invalidUser = true;
                        s.validSecValidate = function (valid) {
                            s.invalidUser = s.userDetailsEditMode = !valid;
                        }
                    },
                    post: function (s) {

                        var alreadyHaveMasterCreditCart = s.card.number.length > 0;
                        var alreadyHaveSafePayCart = s.savePay.username.length > 0;

                        s.firstTag = true;
                        s.imgRadioButton = s.accountDetails.defaultPaymentMethodId + "" == "20" ? 2
                            : s.savePay.username.length > 0 ? 1
                            : s.card.number.length > 0 ? 2 : 1;

                        s.countries = null;
                        registerService.getAllCountries().then(function (countries) {
                            for (var i  in countries) {
                                if (countries[i].id == s.user.countryId) {
                                    s.country = countries[i];
                                    break;
                                }
                            }
                            s.countries = countries;
                        });

                        s.backToMainShippingDetails = function () {
                            if (s.invalidUser) {
                                return;
                            }
                            s.userDetailsEditMode = false;
                        }

                        s.accountUpdate = function () {

                            s.user.countryId = s.country.id;
                            s.user.country = s.country.isoName;
                            if (s.agree_Agreement) {
                                orderService.accountUpdate(s.user).then(function (res) {
                                    UpdateShippingCost();
                                });
                            }
                            else {
                                UpdateShippingCost();
                            }
                        }

                        function UpdateShippingCost() {
                            orderService.getShippingCost(s.user).then(function (shipping) {
                                s.shipping = shipping;
                                $timeout(function () {
                                    s.invalidUser = false;
                                    s.userDetailsEditMode = false;
                                    s.firstTag = false;
                                }, 100)
                            });
                        }


                        s.setDefaultCard = true;
                        s.years = [];
                        var now = new Date();
                        for (var i = 0; i < 10; i++) {
                            s.years.push((now.getFullYear() + i) + "");
                        }



                        s.calculateMonths = function (value) {
                            var arr = Helper.getMonthInYearForMasterCredit(value, s.month);
                            if (arr != null) {
                                s.month = arr;
                                if(s.card && s.card.expirationDate && s.card.expirationDate.month) {
                                    for (var i = 0; i < arr.length; i++) {
                                        if (arr[i] == s.card.expirationDate.month) {
                                            return;
                                        }
                                    }
                                    s.card.expirationDate.month = arr[0];
                                }
                            }
                        };

                        s.month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                        if(!(s.card && s.card.expirationDate && s.card.expirationDate.year)){
                            s.card.expirationDate.month = (now.getMonth() < 10 ? "0" : "") +  now.getMonth();
                            s.card.expirationDate.year = now.getFullYear() + "";
                            s.calculateMonths(s.card.expirationDate.year)
                        }

                        if (now.getFullYear() == s.card.expirationDate.year) {
                            var currentMonth = now.getMonth() + 1;
                            s.month = [];
                            for(var i = currentMonth; i <= 12; i++){
                                s.month.push((i < 10 ? "0" + i : "" + i))
                            }
                        }


                        var safePayBussy = false;
                        var tempPass;

                        function safePay(TransPaymentMethod, accountNumber) {

                            if (safePayBussy) {
                                return;
                            }
                            safePayBussy = true;

                            if (s.savePay && s.savePay.password.length == 12) {
                                if (s.$parent.secretPassword.indexOf(s.savePay.password) != -1) {
                                    tempPass = s.savePay.password;
                                    s.savePay.password = s.$parent.secretPassword;
                                }
                            }
                            orderService.SafePay(s.user, s.savePay, s.card, s.shipping, s.cart, accountNumber, TransPaymentMethod)
                                .then(function (res) {

                                        if (res.success) {
                                            rs.$broadcast('updatePaymentEnd', {
                                                paymentEnd: true,
                                                orderNumber: res.orderNumber,
                                                trackingNumber: res.paymentConfirmationNumber,
                                                cardNumber: +s.card.number + '',
                                                TransPaymentMethod: TransPaymentMethod
                                            });
                                            Helper.scrollPageUp();
                                            safePayBussy = false;
                                            return;
                                        }
                                        safePayBussy = false;
                                        s.paymentEnd = false;

                                    }, function (err) {
                                        /**
                                         * Mark user story $10,000 begin
                                         */
                                        console.log("xxxxx:safePay error!!!");
                                        alert("A transaction error has occurred. Please make sure your payment information is correct. If the problem persists, please contact Support.");
                                        /**
                                         * Mark user story $10,000 End
                                         */
                                        console.log(err);
                                        safePayBussy = false;
                                        s.paymentEnd = false;
                                    }
                                );

                            if (tempPass) {
                                s.savePay.password = tempPass;
                            }
                        }


                        s.payNow_SafePay = function () {
                            if (s.saveSafePay) {
                                if (!alreadyHaveSafePayCart) {
                                    accountService.addSafePayMethod(s.savePay)
                                }
                                else {
                                    accountService.updateSafePayMethod(s.savePay)
                                }
                            }
                            var TransPaymentMethod = "SafePay";
                            var accountNumber = "843200971";
                            safePay(TransPaymentMethod, accountNumber);

                        }


                        s.payNow_masterCredit = function () {
                            if (s.saveMasterCredit) {
                                if (!alreadyHaveMasterCreditCart) {
                                    accountService.addMasterCreditMethod(s.card)
                                }
                                else {
                                    accountService.updateMasterCreditMethod(s.card);
                                }
                            }
                            var TransPaymentMethod = "MasterCredit";
                            var accountNumber = "112987298763";
                            safePay(TransPaymentMethod, accountNumber);
                        }

                        s.payNow_manual = function () {
                            s.payNow_masterCredit()
                        }

                        s.shippingDetails_next = function () {
                            s.firstTag = false;
                            s.showMasterCart = s.noCards || (s.card && s.card.cartExpired);
                        }

                        s.imgRadioButtonClicked = function (num) {
                            s.imgRadioButton = num;
                            s.showMasterCart = s.noCards || (s.card && s.card.cartExpired);
                        }

                        s.paymentMethod_edit = function () {
                            s.noCards = true;
                        }

                        s.Back_to_shipping_details = function () {
                            s.firstTag = true;
                            s.showMasterCart = s.noCards;
                        }

                        s.toggleShowMasterCart = function(){
                            s.showMasterCart = !s.showMasterCart;
                        }

                        s.setUserDetailsEditMode = function(){
                            s.userDetailsEditMode = true;
                        }
                    }
                }
            }
        }]);
});


