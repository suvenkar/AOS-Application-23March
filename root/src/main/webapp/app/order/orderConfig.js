/**
 * Created by correnti on 31/12/2015.
 */

define([], function () {

    function config($stateProvider) {

        $stateProvider.
        state('orderPayment', {
            url: '/orderPayment',
            templateUrl: 'app/order/views/orderPayment-page.html',
            controller: 'orderPaymentCtrl',
            controllerAs: 'opCtrl',
            data: {
                //requireLogin: true,  // this property will apply to all children of 'app'
                breadcrumbName: "orderPayment",
            },
            resolve: {
                resolveParams: function ($q, orderService, accountService) {
                    var defer = $q.defer();

                    orderService.getAccountById().
                    then(function (user) {
                        if (user) {

                                accountService.getAccountDetails().then(
                                    function (accountDetails) {

                                        orderService.getShippingCost(user).
                                        then(function (shippingCost) {

                                            accountService.getAccountPaymentPreferences().
                                            then(function (paymentPreferences) {
                                                defer.resolve({
                                                    paymentPreferences: paymentPreferences,
                                                    shippingCost: shippingCost,
                                                    user: user,
                                                    accountDetails: accountDetails,
                                                });
                                            });
                                        });
                                    });
                        }
                        else {
                            defer.resolve({
                                shippingCost: null,
                                user: null
                            });
                        }
                    });
                    return defer.promise;
                }
            }
        }).
        state('login', {
            url: '/login',
            templateUrl: 'app/order/views/user-not-login-page.html',
            controller: 'userNotLoginCtrl',
        });
    }

    return ['$stateProvider', config];

});

