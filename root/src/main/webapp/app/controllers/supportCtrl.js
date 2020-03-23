/**
 * Created by correnti on 18/02/2016.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('supportCtrl', ['$scope', 'registerService',

        function (s, registerService) {

            s.hola_mundo = "hola_mundohola_mundohola_mundohola_mundo"

            //s.model = "";
            s.model2 = "t@y.sec";
            s.model3 = "e@e.sec";
            s.model4 = "r@r.sec";

            s.model30 = null;

            s.isSended = function (sended) {
                alert(sended);
            }

            //s.isSended = function (valid) {
            //    console.log(valid);
            //}

            //ng-options="country.name for country in countries track by country.id"


            s.countries;
            registerService.getAllCountries().then(function (countries) {
                s.countries = countries;
            });

            s.sec_select_order = {
                showBy : 'name',
            }

            //option.name for option in data.availableOptions track by option.id



            s.require = {
                error: 'this field is required ',
                info: '- this field have to have value',
            }

            s.checkboxRequire = {
                error: ' You must agree to the www.AdvantageOnlineShopping.com Conditions of Use and Privacy Notice. ',
                info: 'I agree to the www.AdvantageOnlineShopping.com Conditions of Use and Privacy Notice',
            }


            s.minLength = {
                error: 'Use up of 4 character',
                info: '- Use up of 4 character',
                min: 4,
            }

            s.maxLength = {
                error: 'Use maximum 8 character',
                info: '- Use maximum 8 character',
                max: 8,
            }

            s.email = {
                error : "Your email address isn’t formatted correctly",
                info: "- A valid email required",
                regex : "^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$"
            }

            s.compareTo = {
                error : "Same as Username",
                info: "- A param have to be exactly like UserName",
                model : s.model
            }
        }]);
});













































//l(paramsToResorve.categories)


//s.supportSuccess = false;
//s.registerAnswer = { class: "", message: "" }
//s.supportModel = {
//    "category": {},
//    "email": "",
//    "product": {},
//    "subject": ""
//}
//
//s.categories = paramsToResorve.categories;
//s.products;
//
//s.categoryChange = function() {
//    categoryService.getCategoryById(s.supportModel.category.categoryId).
//    then(function (category) {
//        l(category.products)
//        s.products = category.products;
//        s.supportModel.product = category.products[0];
//    });
//}
//
//s.productChange = function() {
//    l("s.supportModel.================")
//    l(s.supportModel.product);
//    l(s.supportModel.category.categoryId);
//    l(s.supportModel.category.categoryName);
//    l(s.supportModel.text);
//    l(s.supportModel.product.productId);
//    l(s.supportModel.product.productName);
//    l(s.supportModel.subject);
//    l("s.supportModel.product ++++++++++++++++++++")
//}
//
//s.sendSupportEmail = function(){
//
//    supportService.sendSupportEmail(s.supportModel).then(function(res){
//
//        s.registerAnswer.class = res.success ? "valid" : "invalid";
//        s.supportSuccess = res.success;
//        s.registerAnswer.message = res.reason;
//
//    }, function(err){
//    });
//
//}
//

//Helper.forAllPage();






























