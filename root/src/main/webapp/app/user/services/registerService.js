/**
 * Created by kubany on 10/13/2015.
 */
define(['./module'], function (services) {
    'use strict';
    services.service('registerService', ['$http', '$q', function ($http, $q) {
            // Return public API.
            return ({
                register: register,
                getAllCountries: getAllCountries,
            });

            var countries;

            function getAllCountries() {

                var defer = $q.defer();
                if (countries) {
                    defer.resolve(countries);
                }
                else {
                    var params = server.account.getAllCountries();

                    $.soap({
                        url: params.path ,
                        method: params.method,
                        namespaceURL: server.namespaceURL,
                        SOAPAction: server.namespaceURL + params.method,
                        data: {},
                        success: function (soapResponse) {
                            var response = soapResponse.toJSON(params.response);
                            countries = response.Country;
                            Helper.disableLoader();
                            Loger.Received(response);
                            defer.resolve(countries);
                        },
                        error: function (response) {
                            Loger.Received(response);
                            Helper.disableLoader();
                            defer.reject("Request failed! ");
                        },
                        enableLogging: true
                    });
                }
                return defer.promise;
            }

            function register(model) {

                var expectToReceive = {
                    "accountType": 20,
                    "address": model.address,
                    "allowOffersPromotion": model.offers_promotion ? 'Y' : 'N',
                    "cityName": model.city,
                    "countryId": model.country && model.country.id ? model.country.id : 40,
                    "email": model.email,
                    "firstName": model.firstName,
                    "lastName": model.lastName,
                    "loginName": model.username,
                    "password": model.password,
                    "phoneNumber": model.phoneNumber,
                    "stateProvince": model.state,
                    "zipcode": model.postalCode,
                }

                var defer = $q.defer();
                var params = server.account.register();
                Loger.Params(expectToReceive, params.method);

                Helper.enableLoader(10);

                $.soap({
                    url: params.path ,
                    method: params.method,
                    namespaceURL: server.namespaceURL,
                    SOAPAction: server.namespaceURL + params.method,
                    data: expectToReceive,
                    success: function (soapResponse) {
                        var response = soapResponse.toJSON(params.response);
                        Helper.disableLoader();
                        Loger.Received(response);
                        defer.resolve(response.StatusMessage);
                    },
                    error: function (response) {
                        Loger.Received(response);
                        Helper.disableLoader();
                        defer.reject("Request failed! ");
                    },
                    enableLogging: true
                });

                return defer.promise;
            }

        }]);
});