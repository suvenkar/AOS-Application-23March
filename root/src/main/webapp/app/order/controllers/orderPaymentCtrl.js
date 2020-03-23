/**
 * Created by correnti on 31/12/2015.
 */


define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('orderPaymentCtrl', ['$scope', '$rootScope', 'resolveParams',
        'orderService', 'productsCartService', '$filter', '$location',
        function (s, rs, resolveParams, orderService, cartService, $filter, $location) {


            if (resolveParams.user == null) {
                $location.path('login')
                return;
            }
            s.user = resolveParams.user;
            s.accountDetails = resolveParams.accountDetails;
            s.checkCart();

            ///// PAYMENT SUCCESS ////
            s.paymentEnd = false;
            s.$on('updatePaymentEnd', function (event, args) {
                s.paymentEnd = args.paymentEnd;
                s.orderNumber = args.orderNumber;
                s.trackingNumber = args.trackingNumber;
                s.cardNumber = ['0000', '0000', '0000', args.cardNumber.substring(args.cardNumber.length - 4)];
                s.subTotal = ($filter("productsCartSum")(s.cart));
                s.total = ($filter("productsCartSum")(s.cart, s.shippingCost));
                s.TransPaymentMethod = args.TransPaymentMethod;
                rs.$broadcast('clearCartEvent');
            });
            ///// END PAYMENT SUCCESS ////

            s.noCards = !(resolveParams.paymentPreferences && resolveParams.paymentPreferences.masterCredit);
            s.showMasterCart = false;
            s.card = {number: '', cvv: '', expirationDate: {month: '', year: ''}, name: ''}
            s.savePay = {username: '', password: ''}

            var masterCredit = resolveParams.paymentPreferences && resolveParams.paymentPreferences.masterCredit ?
                resolveParams.paymentPreferences.masterCredit : null;

            s.CardNumber = [];
            if (masterCredit != null) {
                //noinspection JSAnnotator
                try {
                    var m = masterCredit.expirationDate.substring(0, 2)
                }
                catch(err) {
                    m = ( masterCredit.expirationDate += "").substring(0,2)
                }
                s.card = {
                    number: masterCredit.cardNumber.substring(4),
                    cvv: masterCredit.cvvNumber,
                    expirationDate: {
                        month: m,
                        year: masterCredit.expirationDate.substring(2)
                    },
                    cartExpired: masterCredit.cartExpired,
                    name: masterCredit.customername,
                }
                s.CardNumber = splitCartNumber(masterCredit.cardNumber);
            }

            function splitCartNumber(cartNum) {
                var arr = [];
                for (var i = 0; i < cartNum.length && i + 3 < cartNum.length; i += 4) {
                    arr.push(cartNum.substring(i, i + 4));
                }
                return arr;
            }

            var safePay = resolveParams.paymentPreferences && resolveParams.paymentPreferences.safePay ?
                resolveParams.paymentPreferences.safePay : null;
            s.secretPassword = "****";
            if (safePay != null) {
                s.savePay.username = safePay.safepayUsername;
                s.secretPassword = safePay.safepayPassword;
                s.savePay.password = s.secretPassword.substring(0, 12);
            }
            s.saveSafePay = true;
            s.saveMasterCredit = true;

            s.agree_Agreement = true;

            s.shipping = resolveParams.shippingCost;
            s.shippingCost = resolveParams.shippingCost ? resolveParams.shippingCost.amount : null;
            s.itemsPaid = s.cart ? s.cart.productsInCart.length : 0;

            var d = new Date();
            s.Date_Ordered = [d.getDate(), (d.getMonth() + 1), d.getFullYear()].join('/');

            Helper.forAllPage();

        }]);
});




