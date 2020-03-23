/**
 * Created by kubany on 10/13/2015
 */
'use strict';

define([

    'angular',
    'jquery',
    'bootstrap',
    'jPushMenu',

    './app/configuration/appConfig',
    './app/user/userConfig',
    './app/order/orderConfig',
    './app/account/accountConfig',


    './app/controllers/index',
    './app/user/controllers/index',
    './app/order/controllers/index',
    './app/account/controllers/index',


    './app/user/services/index',
    './app/order/services/index',
    './app/services/index',
    './app/account/services/index',


    './app/filters/index',


    './app/directives/index',
    './app/user/directives/index',
    './app/order/directives/index',
    './app/account/directives/index',
    './app/SECORRENTI/sec-input/index',

    './app/templates/module',

], function (angular, templates, bootstrap, jPushMenu, catalogConfig, userConfig, orderConfig, accountConfig) {

    return angular.module('aos', [

        'pascalprecht.translate',
        'ui.router',
        'ui.bootstrap',
        'ipCookie',
        'ngAnimate',


        'aos.controllers',
        'aos.services',
        'aos.directives',
        'aos.filters',
        'aos.templates',

        'aos.user.controllers',
        'aos.user.services',
        'aos.user.directives',

        'aos.order.controllers',
        'aos.order.services',
        'aos.order.directives',


        'aos.account.controllers',
        'aos.account.services',
        //'aos.account.directives',


    ]).

    config(catalogConfig).

    config(userConfig).

    config(orderConfig).

    config(accountConfig).

    run(function ($rootScope, $state, ipCookie) {


            //$http.defaults.headers.get = { 'Content-Type': "application/json", }

            var pcBlocked = ipCookie("pcBlocked");
            if (pcBlocked) {
                if (new Date().getTime() > pcBlocked) {
                    ipCookie.remove("pcBlocked");
                }
                else {
                    $state.go('404');
                }
            }

            $rootScope.userCookieLastEntry = ipCookie('lastlogin');
            if ($rootScope.userCookieLastEntry) {
                var cookie = ipCookie($rootScope.userCookieLastEntry);
                if (cookie) {
                    $rootScope.userCookie = cookie;
                }
            }

            $rootScope.$on('$stateChangeError', function (a, b, c, d, e, f) {
                console.log(a);
                console.log(b);
                console.log(c);
                console.log(d);
                console.log(e);
                console.log(f);
                //$state.go('404');
            });

            $rootScope.breadcrumb = [{
                name: "Home Page",
                path: "/",
            }];

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            //var requireLogin = toState.data.requireLogin;
            //var showWelcome = toState.data.showWelcome;
            //var underConstruction = toState.data.underConstruction;

            /*
             showWelcome != 'undefined' && showWelcome ? $(document.body).addClass('welcome-page') : $(document.body).removeClass('welcome-page');
             underConstruction != 'undefined' && underConstruction ?
             $(document.body).addClass('under-construction') :
             $(document.body).removeClass('under-construction');

             if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
             event.preventDefault();
             // get me a login modal!
             }
             */
            //alert("start");
            Helper.enableLoader(999);

        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            Helper.disableLoader(0);
        });
    });

});

var l = function (a) {
    console.log(a)
}

var t = function (a) {
    alert(a)
}

var print = function (a) {
    console.log(" ");
    console.log("  ");
    console.log(a);
    console.log("******************************");
    console.log(" ");
    console.log("  ");
}
