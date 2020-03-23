                        define(["angular"], function (angular) {                            "use strict";                            var templates = angular.module("aos.templates", []);                            templates.run(function($templateCache) {                              'use strict';

  $templateCache.put('app/partials/category_type_products_tpl.html',
    "<div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"cell categoryLeft\">\r" +
    "\n" +
    "        <p class=\"filterCount roboto-light\">\r" +
    "\n" +
    "            <a class=\"titleItemsCount\">\r" +
    "\n" +
    "                {{([] | productsFilterForCategoriesProduct:searchResult:minPriceToFilter:maxPriceToFilter:productsInclude).length}} {{ 'ITEMS' | translate }}\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <span data-ng-click=\"toggleFilterSlide('mobileSlide')\">\r" +
    "\n" +
    "                <img src=\"../../css/images/Filter.png\" alt=\"filter\"/>\r" +
    "\n" +
    "                {{ 'Filter' | translate }}\r" +
    "\n" +
    "                ({{([] | productsFilterForCategoriesProduct:searchResult:minPriceToFilter:maxPriceToFilter:productsInclude).length}})\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"mobileSlide\">\r" +
    "\n" +
    "            <label class=\"roboto-regular\">{{ 'FILTER_BY' | translate }}\r" +
    "\n" +
    "                <label class=\"roboto-regular clear\" ng-click=\"clearSelection()\" translate=\"Clear\"\r" +
    "\n" +
    "                       ng-show=\"showClear\"></label>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <!--- categories filter Section -->\r" +
    "\n" +
    "                <li ng-if=\"categoriesFilter != null\">\r" +
    "\n" +
    "                    <h4 class=\"accordion roboto-regular arrowDown arrowUp\"\r" +
    "\n" +
    "                        id=\"accordionCategories\"\r" +
    "\n" +
    "                        ng-click=\"toggleColapse('accordionCategories')\"\r" +
    "\n" +
    "                        translate=\"CATEGORIES\">\r" +
    "\n" +
    "                    </h4>\r" +
    "\n" +
    "                    <div class=\"option\" style=\"display: block\">\r" +
    "\n" +
    "                        <div ng-repeat=\"categ in categoriesFilter\">\r" +
    "\n" +
    "                            <div class=\"fill\">\r" +
    "\n" +
    "                                <input type=\"checkbox\"\r" +
    "\n" +
    "                                       ng-model=\"categ.checked\"\r" +
    "\n" +
    "                                       ng-click=\"includeProducts(categ.id, 'CATEGORIES')\">\r" +
    "\n" +
    "                                <span class=\"roboto-regular\">{{categ.name}}</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <!--- END categories filter Section -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!--- Price filter Section-->\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <!--data-ng-class=\"{ arrowUp : viewAll }\"-->\r" +
    "\n" +
    "                    <h4 class=\"accordion roboto-regular arrowDown\"\r" +
    "\n" +
    "                        id=\"accordionPrice\"\r" +
    "\n" +
    "                        ng-click=\"toggleColapse('accordionPrice')\"\r" +
    "\n" +
    "                        translate=\"PRICE\"></h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <!--<div class=\"option\">-->\r" +
    "\n" +
    "                    <div class=\"option\" style=\"text-align: center\"\r" +
    "\n" +
    "                         data-ng-style=\"viewAll ? {'display': 'block'} : {}\">\r" +
    "\n" +
    "                        <div id=\"slider\"></div>\r" +
    "\n" +
    "                        <br/>\r" +
    "\n" +
    "                        <p class=\"sliderSteps left\">${{ minPriceToFilter | number }}</p>\r" +
    "\n" +
    "                        <p class=\"sliderSteps \">${{ maxPriceToFilter | number }}</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <!--- END Price filter Section -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!--- attributes filter Section -->\r" +
    "\n" +
    "                <li ng-repeat=\"attrib in attributesToShow\">\r" +
    "\n" +
    "                    <h4 class=\"accordion roboto-regular arrowDown\" id=\"accordionAttrib{{$index}}\"\r" +
    "\n" +
    "                        ng-click=\"toggleColapse('accordionAttrib' + $index)\">\r" +
    "\n" +
    "                        {{attrib.name}}\r" +
    "\n" +
    "                    </h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"option\">\r" +
    "\n" +
    "                        <div ng-repeat=\"attrVal in attrib.values\">\r" +
    "\n" +
    "                            <div class=\"fill iconCss\" >\r" +
    "\n" +
    "                                <input type=\"checkbox\" ng-model=\"item.selected\"\r" +
    "\n" +
    "                                       ng-click=\"includeProducts(attrVal, attrib.name)\">\r" +
    "\n" +
    "                                <span class=\"roboto-regular\" data-ng-click=\"item.selected = !item.selected; includeProducts(attrVal, attrib.name)\">{{::attrVal}}</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <!--- END attributes filter Section -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <!--- color filter Section -->\r" +
    "\n" +
    "                <li ng-if=\"productsColors.length > 0\">\r" +
    "\n" +
    "                    <h4 class=\"accordion roboto-regular arrowDown\" id=\"accordionColor\"\r" +
    "\n" +
    "                        ng-click=\"toggleColapse('accordionColor')\" translate=\"COLOR\"></h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"option\">\r" +
    "\n" +
    "                        <div ng-repeat=\"color in productsColors\" class=\"inline-block\">\r" +
    "\n" +
    "                            <a title=\"{{color.name}}\" class=\"productColor \" id=\"productsColors{{color.code}}\"\r" +
    "\n" +
    "                               ng-click=\"includeProducts(color, 'COLOR'); toggleColorSelectedClass(color.code)\"\r" +
    "\n" +
    "                               ng-style=\" color.code == 'FFFFFF' ?\r" +
    "\n" +
    "                              {'backgroundColor': '#' + color.code, 'border': 'solid 1px #9d9d9d' } :\r" +
    "\n" +
    "                              {'backgroundColor': '#' + color.code, 'border': 'solid 1px transparent'}\">\r" +
    "\n" +
    "                                <!--- <label></label> -->\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <!--- END color filter Section -->\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"cell categoryRight\" data-ng-show=\"([] | productsFilterForCategoriesProduct:searchResult:minPriceToFilter:maxPriceToFilter:productsInclude).length != 0\">\r" +
    "\n" +
    "        <ul>\r" +
    "\n" +
    "            <li ng-repeat=\"product in [] | productsFilterForCategoriesProduct:searchResult:minPriceToFilter:maxPriceToFilter:productsInclude\"\r" +
    "\n" +
    "                ng-click=\"$location.path('/product/' + product.productId)\">\r" +
    "\n" +
    "                <div class=\"soulOut\" data-ng-show=\"product.productStatus == 'OutOfStock'\">\r" +
    "\n" +
    "                    <span class=\"roboto-medium\" translate=\"SOUL_OUT\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"AddToCard\"\r" +
    "\n" +
    "                     data-ng-class=\"{ outOfStock : product.productStatus == 'OutOfStock' } \">\r" +
    "\n" +
    "                    <label translate=\"SHOP_NOW\"></label>\r" +
    "\n" +
    "                    <div icon-cart-svg style=\"width: 18px; height: 18px; \"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <img alt=\"\" class=\"imgProduct\"\r" +
    "\n" +
    "                     data-ng-class=\"{ outOfStock : product.productStatus == 'OutOfStock' } \"\r" +
    "\n" +
    "                     data-ng-src=\"/catalog/fetchImage?image_id={{product.imageUrl}}\">\r" +
    "\n" +
    "                <p><a class=\"productName\">{{product.productName}}</a></p>\r" +
    "\n" +
    "                <p><a class=\"productPrice\">{{product.price | currency:\"$\"}} </a></p>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"cell categoryRight textAlignCenter\" data-ng-show=\"([] | productsFilterForCategoriesProduct:searchResult:minPriceToFilter:maxPriceToFilter:productsInclude).length == 0\">\r" +
    "\n" +
    "        <label class=\"noProducts roboto-bold \">\r" +
    "\n" +
    "            <span translate=\"No_results\"></span>\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/e-sec-plus-minus.html',
    "<div class=\"e-sec-plus-minus\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"minus\" increment-value-attr=\"-\" ></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <input type=\"text\" ng-model=\"numAttr\" numbers-only />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"plus\" increment-value-attr=\"+\" ></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/icon-cart-svg.html',
    "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r" +
    "\n" +
    "     width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" enable-background=\"new 0 0 24 24\" xml:space=\"preserve\">\r" +
    "\n" +
    "    <path fill=\"#313131\" d=\"M9,20c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2C11,20.9,10.1,20,9,20z M19,20c-1.1,0-2,0.9-2,2\r" +
    "\n" +
    "        c0,1.1,0.9,2,2,2s2-0.9,2-2C21,20.9,20.1,20,19,20z M8.3,15h12.5L24,4H5.5L4.8,1H0v2h3.2l4,16H21v-2H8.8L8.3,15z M6,6h15.3l-2,7\r" +
    "\n" +
    "        H7.8L6,6z\"/>\r" +
    "\n" +
    "</svg>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/icon-home-svg.html',
    "<svg version=\"1.1\"\r" +
    "\n" +
    "\t id=\"Layer_1\"\r" +
    "\n" +
    "\t xmlns=\"http://www.w3.org/2000/svg\"\r" +
    "\n" +
    "\t xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r" +
    "\n" +
    "\t x=\"0px\"\r" +
    "\n" +
    "\t y=\"0px\"\r" +
    "\n" +
    "\t width=\"24px\"\r" +
    "\n" +
    "\t height=\"24px\"\r" +
    "\n" +
    "\t viewBox=\"0 0 24 24\"\r" +
    "\n" +
    "\t enable-background=\"new 0 0 24 24\"\r" +
    "\n" +
    "\t xml:space=\"preserve\">\r" +
    "\n" +
    "\t<path fill=\"#313131\" d=\"M21,24H3V10l-1.7,1.4L0,9.8L12,0l12,9.8l-1.3,1.5L21,10V24z M16,22h3V8.3l-7-5.7L5,8.3V22h3v-8h8V22z M10,22 h4v-6h-4V22z\"/>\r" +
    "\n" +
    "</svg>"
  );


  $templateCache.put('app/partials/icon-search-svg.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r" +
    "\n" +
    "\t width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" enable-background=\"new 0 0 24 24\" xml:space=\"preserve\">\r" +
    "\n" +
    "<path fill=\"#313131\" d=\"M23.7,22l-6.8-5.6c0,0-0.1,0-0.1-0.1c3.1-3.8,2.9-9.4-0.6-12.9c-1.8-1.8-4.2-2.8-6.7-2.8\r" +
    "\n" +
    "\tc-2.5,0-4.9,1-6.7,2.8c-3.7,3.7-3.7,9.8,0,13.6c1.8,1.8,4.2,2.8,6.7,2.8c2.3,0,4.4-0.8,6.1-2.2c0,0,0,0.1,0.1,0.1l6.8,5.6\r" +
    "\n" +
    "\tc0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.4-0.1,0.6-0.3C24.1,22.9,24.1,22.3,23.7,22z M9.5,17.9c-2.1,0-4-0.8-5.5-2.3c-3-3.1-3-8,0-11.1\r" +
    "\n" +
    "\tc1.5-1.5,3.4-2.3,5.5-2.3c2.1,0,4,0.8,5.5,2.3c3,3.1,3,8,0,11.1C13.5,17.1,11.6,17.9,9.5,17.9z\"/>\r" +
    "\n" +
    "</svg>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/icon-user-svg.html',
    "<a title=\"{{ 'USER' | translate }}\">\r" +
    "\n" +
    "    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r" +
    "\n" +
    "     width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" enable-background=\"new 0 0 24 24\" xml:space=\"preserve\">\r" +
    "\n" +
    "        <path fill=\"#313131\" d=\"M12,13.6c3.3,0,5.9-3.1,5.9-6.8C17.9,3.1,15.3,0,12,0C8.7,0,6.1,3.1,6.1,6.8C6.1,10.6,8.7,13.6,12,13.6z\r" +
    "\n" +
    "             M12,2.1c2.1,0,3.8,2.1,3.8,4.7c0,2.6-1.7,4.7-3.8,4.7c-2.1,0-3.8-2.1-3.8-4.7C8.2,4.2,9.9,2.1,12,2.1z M20,14.3\r" +
    "\n" +
    "            c-0.4-0.4-1.1-0.3-1.5,0.1c-0.4,0.4-0.3,1.1,0.1,1.5c0.6,0.5,1.1,1.8,1.1,2.4c0,1.4-0.3,2.3-0.8,2.8C18,22,16,22,13.3,21.9\r" +
    "\n" +
    "            c-0.9,0-1.8,0-2.7,0C8,22,6,22,5.1,21.1c-0.5-0.5-0.8-1.4-0.8-2.8c0-0.9,0.3-1.7,1-2.5c0.4-0.4,0.3-1.1-0.1-1.4\r" +
    "\n" +
    "            C4.7,14,4.1,14,3.7,14.5c-1,1.2-1.5,2.4-1.5,3.8c0,1.9,0.5,3.3,1.4,4.2c1.5,1.5,4,1.5,7.1,1.5c0.9,0,1.8,0,2.7,0\r" +
    "\n" +
    "            c0.4,0,0.8,0,1.2,0c2.5,0,4.6-0.2,5.9-1.5c0.9-0.9,1.4-2.3,1.4-4.2C21.8,17.2,21.1,15.3,20,14.3z\"/>\r" +
    "\n" +
    "    </svg>\r" +
    "\n" +
    "</a>\r" +
    "\n"
  );


  $templateCache.put('app/partials/mobileSearch.html',
    "<div id=\"mobileSearch\" data-ng-cloak>\r" +
    "\n" +
    "    <input type=\"text\" class=\"roboto-medium\" placeholder=\"{{ 'Search' | translate}}\"\r" +
    "\n" +
    "           data-ng-keypress=\"checkEnterKey($event)\"\r" +
    "\n" +
    "           data-ng-model=\"autoCompleteValue\"\r" +
    "\n" +
    "           data-ng-keyup=\"runAutocomplete()\"\r" +
    "\n" +
    "    >\r" +
    "\n" +
    "    <div class=\"img\" icon-search-svg data-ng-click=\"goToCategoryPage()\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/popular-Items-tpl.html',
    "\r" +
    "\n" +
    "<!-- POPULAR ITEMS -->\r" +
    "\n" +
    "<article>\r" +
    "\n" +
    "    <h3 class=\"roboto-regular center\" translate=\"POPULAR_ITEMS\">\r" +
    "\n" +
    "        <!-- {{'SPACIAL_OFFER' | translate}} -->\r" +
    "\n" +
    "    </h3>\r" +
    "\n" +
    "    <div class=\"grid-table\">\r" +
    "\n" +
    "        <div ng-repeat=\"product in popularProducts\" ng-if=\"popularProducts.length > 0\">\r" +
    "\n" +
    "            <figure>\r" +
    "\n" +
    "                <img data-ng-src=\"{{product.imageUrl}}\" alt=\"Special-offer\" >\r" +
    "\n" +
    "            </figure>\r" +
    "\n" +
    "            <label class=\"shop_now center\">{{product.productName}}</label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</article>\r" +
    "\n" +
    "<!-- end POPULAR ITEMS -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/scrollToTop.html',
    "<div id=\"scrollToTop\">\r" +
    "\n" +
    "    <img src=\"css/images/GoUp.png\" alt=\"GO UP\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p translate=\"GO_UP\"></p>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/partials/secInput.html',
    "<div>\r" +
    "\n" +
    "    <a class=\"must\" ng-show=\"warnings.length > 0 && !noRedStar\">*</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <label class=\"validate-label\"\r" +
    "\n" +
    "           ng-class=\"{ validateInvalid : !textToShow.valid}\"\r" +
    "\n" +
    "           ng-click=\"validateLabelClicked(id)\">\r" +
    "\n" +
    "        {{textToShow.text}}\r" +
    "\n" +
    "    </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <input type=\"{{inputType}}\" name=\"{{id}}\" autocapitalize=\"off\"\r" +
    "\n" +
    "           autocomplete=\"off\" autocorrect=\"off\" class=\"inputtext\"\r" +
    "\n" +
    "           data-ng-class=\"{ validateInvalid : !textToShow.valid }\"\r" +
    "\n" +
    "           data-ng-hide=\"inputType == 'transclude'\"\r" +
    "\n" +
    "           data-ng-model=\"modelAttr\"\r" +
    "\n" +
    "           data-ng-focus=\"inputFocus(id)\"\r" +
    "\n" +
    "           data-ng-blur=\"inputBlur(id)\"\r" +
    "\n" +
    "           data-ng-keyup=\"inputKeyup(id)\"\r" +
    "\n" +
    "           id=\"secInput_{{id}}\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-transclude data-ng-show=\"inputType == 'transclude'\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"validate-info\" ng-show=\"warnings.length > 0 && !doNotShowInfo\">\r" +
    "\n" +
    "        <ul>\r" +
    "\n" +
    "            <li data-ng-repeat=\"info in warnings\" data-ng-show=\"info.info != '' && info.show\" >\r" +
    "\n" +
    "                <a>{{ info.info }}</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/secTextarea.html',
    "<div>\r" +
    "\n" +
    "    <a class=\"must\" ng-show=\"warnings.length > 0 && !noRedStar\">*</a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <label class=\"validate-label\"\r" +
    "\n" +
    "           ng-class=\"{ validateInvalid : !textToShow.valid}\"\r" +
    "\n" +
    "           ng-click=\"validateLabelClicked(id)\">\r" +
    "\n" +
    "        {{textToShow.text}}\r" +
    "\n" +
    "    </label>\r" +
    "\n" +
    "    <textarea name=\"{{id}}\" class=\"inputtext\"\r" +
    "\n" +
    "           data-ng-class=\"{ validateInvalid : !textToShow.valid }\"\r" +
    "\n" +
    "           data-ng-model=\"modelAttr\"\r" +
    "\n" +
    "           data-ng-focus=\"inputFocus(id)\"\r" +
    "\n" +
    "           data-ng-blur=\"inputBlur(id)\"\r" +
    "\n" +
    "           data-ng-keyup=\"inputKeyup(id)\"\r" +
    "\n" +
    "           id=\"secInput_{{id}}\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"validate-info\" ng-show=\"warnings.length > 0\">\r" +
    "\n" +
    "        <ul>\r" +
    "\n" +
    "            <li data-ng-repeat=\"info in warnings\" data-ng-show=\"info.info != '' && info.show\" >\r" +
    "\n" +
    "                <a>{{ info.info }}</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/social-media-tpl.html',
    "\r" +
    "\n" +
    "<footer>\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <!-- FOLLOW US -->\r" +
    "\n" +
    "        <h3 class=\"roboto-regular center\">\r" +
    "\n" +
    "            FOLLOW US <!-- {{'FOLLOW_US' | translate}} -->\r" +
    "\n" +
    "        </h3>\r" +
    "\n" +
    "        <div id=\"follow\" class=\"center\">\r" +
    "\n" +
    "            <a target=\"_blank\" href=\"https://www.facebook.com/pages/HP-Application-Lifecycle-Management/142893435778219?fref=ts\">\r" +
    "\n" +
    "                <img src=\"css/images/facebook.png\" alt=\"icon\" data-ng-click=\"linkTo('')\" />\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <a target=\"_blank\" href=\"https://twitter.com/HPE_ALM\">\r" +
    "\n" +
    "                <img src=\"css/images/twitter.png\" alt=\"icon\" />\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <a target=\"_blank\" href=\"https://www.linkedin.com/company/1024?trk=tyah&trkInfo=clickedVertical%3Ashowcase%2CclickedEntityId%3A1024%2Cidx%3A2-1-2%2CtarId%3A1454314829327%2Ctas%3Ahewlett%20packard%20enterprise%20software\">\r" +
    "\n" +
    "                <img src=\"css/images/linkedin.png\" alt=\"icon\" />\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <label> © Advantage Inc, 2016. Release 1.0.5 </label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</footer>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/toolTipCart.html',
    "<div>\r" +
    "\n" +
    "    <div ng-hide=\"cart.productsInCart.length > 0\" class=\"emptyCart\" data-ng-click=\"redirect('/shoppingCart')\">\r" +
    "\n" +
    "        <label class=\"center items roboto-bold\"> {{ 'ITEMS' | translate}}\r" +
    "\n" +
    "            <span class=\"roboto-regular\">(0)</span>\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "        <label class=\"center roboto-medium\" translate=\"Your_shopping_cart_is_empty\"></label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <table ng-show=\"cart.productsInCart.length > 0\"  >\r" +
    "\n" +
    "        <tbody >\r" +
    "\n" +
    "            <tr ng-repeat=\"product in cart.productsInCart track by $index\" id=\"product{{product.id}}\"\r" +
    "\n" +
    "                data-ng-class=\"{ lastProduct : $last }\" >\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <a href=\"#/product/{{product.productId}}?color={{product.color.code}}&quantity={{product.quantity}}&pageState=edit\">\r" +
    "\n" +
    "                        <img class=\"imageUrl\" ng-src=\"/catalog/fetchImage?image_id={{product.imageUrl}}\" alt=\"imgProduct\" />\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <a href=\"#/product/{{product.productId}}?color={{product.color.code}}&quantity={{product.quantity}}&pageState=edit\">\r" +
    "\n" +
    "                        <h3>{{ product.productName  | uppercase | secCatWord:30 }}</h3>\r" +
    "\n" +
    "                        <label>{{'QTY' | translate}} {{product.quantity}}</label>\r" +
    "\n" +
    "                        <label>{{'Color' | translate }}\r" +
    "\n" +
    "                            <span>{{product.color.name}}</span>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <p class=\"price roboto-regular\">{{ product.price * product.quantity | currency:'$' }}</p>\r" +
    "\n" +
    "                    <div class=\"closeDiv\" ng-click=\"removeProduct($index, $event)\">\r" +
    "\n" +
    "                        <div icon-x class=\"removeProduct\"></div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "        </tbody>\r" +
    "\n" +
    "        <tfoot  data-ng-click=\"redirect('/shoppingCart')\">\r" +
    "\n" +
    "            <tr>\r" +
    "\n" +
    "                <td colspan=\"2\">\r" +
    "\n" +
    "                    <span class=\"roboto-medium\">{{'TOTAL' | translate}}\r" +
    "\n" +
    "                        <label class=\"roboto-regular\">({{cart | productsCartCount}} {{ (cart | productsCartCount) > 1 ? 'Items' : 'Item' | translate}})</label>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <span class=\"roboto-medium cart-total\" >{{cart | productsCartSum | currency:'$'}}</span>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            <tr>\r" +
    "\n" +
    "                <td colspan=\"3\">\r" +
    "\n" +
    "                    <button class=\"roboto-medium\" data-ng-click=\"checkout($event)\">{{'CHECK_OUT' | translate}}  ({{ cart | productsCartSum:shippingCost | currency:'$' }})</button>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "        </tfoot>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/partials/toolTipSearch.html',
    "\r" +
    "\n" +
    "<div id=\"searchSection\"\r" +
    "\n" +
    "     data-ng-mouseenter=\"allowClosing = false\"\r" +
    "\n" +
    "     data-ng-mouseleave=\"allowClosingLeave()\"\r" +
    "\n" +
    "     data-ng-click=\"closeSearchSection()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"input\" data-ng-click=\"$event.stopPropagation()\">\r" +
    "\n" +
    "        <div id=\"search\">\r" +
    "\n" +
    "            <a title=\"{{ 'SEARCH' | translate }}\">\r" +
    "\n" +
    "                <div icon-search-svg data-ng-click=\"openSearchProducts()\" ></div>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <div class=\"autoCompleteCover\">\r" +
    "\n" +
    "                <input id=\"autoComplete\" type=\"text\" class=\"roboto-regular\"\r" +
    "\n" +
    "                       placeholder=\"{{'Search' | translate }} AdvantageOnlineShopping.com\"\r" +
    "\n" +
    "                       data-ng-keypress=\"checkEnterKey($event)\"\r" +
    "\n" +
    "                       data-ng-model=\"autoCompleteValue\"\r" +
    "\n" +
    "                       data-ng-keyup=\"runAutocomplete()\"\r" +
    "\n" +
    "                       data-ng-blur=\"closeSearchSection()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div data-ng-click=\"closeSearchForce()\"  style=\"position: absolute; right: 0; top:0\" >\r" +
    "\n" +
    "                    <img src=\"../../css/images/closeDark.png\" style=\"width:20px; height:20px; padding: 12px 0\" >\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"output\" data-ng-show=\"autoCompleteResult.length > 0\" >\r" +
    "\n" +
    "        <div class=\"searchPopUp\" data-ng-click=\"$event.stopPropagation()\" >\r" +
    "\n" +
    "            <div class=\"categories\">\r" +
    "\n" +
    "                <h3 class=\"roboto-medium\" translate=\"CATEGORIES\"\r" +
    "\n" +
    "                    data-ng-mouseenter=\"searchByCategoryId(null, '')\">\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "                <a href=\"#/search/{{categoryFilter}}?viewAll={{autoCompleteValue}}\">\r" +
    "\n" +
    "                    <label class=\"roboto-light\"\r" +
    "\n" +
    "                           data-ng-repeat=\"result in autoCompleteResult\"\r" +
    "\n" +
    "                           data-ng-mouseenter=\"searchByCategoryId(result.categoryId, result.categoryName)\">\r" +
    "\n" +
    "                        {{result.categoryName | lowercase}}\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"top6Products\">\r" +
    "\n" +
    "                <h3 class=\"roboto-medium\" >{{ 'TOP' | translate }} {{ 'RESULTS_FOR' | translate }}: \"{{autoCompleteValue}}\"\r" +
    "\n" +
    "                    <p style=\"font-size: 11px !important; font-weight: 300 !important;\" > {{ categoryName }} </p>\r" +
    "\n" +
    "                </h3>\r" +
    "\n" +
    "                <a href=\"#/search/{{categoryFilter}}?viewAll={{autoCompleteValue}}\" translate=\"View_All\"\r" +
    "\n" +
    "                   class=\"roboto-medium viewAll\"></a>\r" +
    "\n" +
    "                <a class=\"product\" href=\"#/product/{{product.productId}}\"\r" +
    "\n" +
    "                   data-ng-click=\"closeSearchSection()\"\r" +
    "\n" +
    "                   data-ng-repeat=\"product in [] | filterFullArrayforAutoComplate:autoCompleteResult:categoryFilter\">\r" +
    "\n" +
    "                    <img data-ng-src=\"/catalog/fetchImage?image_id={{product.imageUrl}}\" />\r" +
    "\n" +
    "                    <p class=\"roboto-regular\">{{product.productName | uppercase}}</p>\r" +
    "\n" +
    "                    <span>{{product.price | currency:'$'}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/user/partials/login.html',
    "<div class=\"PopUp\">\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"loader\">\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <svg width=\"50\" height=\"50\" viewBox=\"0 0 50 50\" xmlns=\"http://www.w3.org/2000/svg\">\r" +
    "\n" +
    "                    <defs>\r" +
    "\n" +
    "                        <linearGradient x1=\"8.042%\" y1=\"0%\" x2=\"65.682%\" y2=\"23.865%\" id=\"a\">\r" +
    "\n" +
    "                            <stop stop-color=\"#54B3AD\" stop-opacity=\"0\" offset=\"0%\"/>\r" +
    "\n" +
    "                            <stop stop-color=\"#54B3AD\" stop-opacity=\".631\" offset=\"63.146%\"/>\r" +
    "\n" +
    "                            <stop stop-color=\"#54B3AD\" offset=\"100%\"/>\r" +
    "\n" +
    "                        </linearGradient>\r" +
    "\n" +
    "                    </defs>\r" +
    "\n" +
    "                    <g fill=\"none\" fill-rule=\"evenodd\">\r" +
    "\n" +
    "                        <g transform=\"translate(1 1)\">\r" +
    "\n" +
    "                            <path d=\"M36 18c0-9.94-8.06-18-18-18\" id=\"Oval-2\" stroke=\"url(#a)\" stroke-width=\"2\">\r" +
    "\n" +
    "                                <animateTransform\r" +
    "\n" +
    "                                        attributeName=\"transform\"\r" +
    "\n" +
    "                                        type=\"rotate\"\r" +
    "\n" +
    "                                        from=\"0 18 18\"\r" +
    "\n" +
    "                                        to=\"360 18 18\"\r" +
    "\n" +
    "                                        dur=\"0.9s\"\r" +
    "\n" +
    "                                        repeatCount=\"indefinite\"/>\r" +
    "\n" +
    "                            </path>\r" +
    "\n" +
    "                            <circle fill=\"#54B3AD\" cx=\"36\" cy=\"18\" r=\"1\">\r" +
    "\n" +
    "                                <animateTransform\r" +
    "\n" +
    "                                        attributeName=\"transform\"\r" +
    "\n" +
    "                                        type=\"rotate\"\r" +
    "\n" +
    "                                        from=\"0 18 18\"\r" +
    "\n" +
    "                                        to=\"360 18 18\"\r" +
    "\n" +
    "                                        dur=\"0.9s\"\r" +
    "\n" +
    "                                        repeatCount=\"indefinite\"/>\r" +
    "\n" +
    "                            </circle>\r" +
    "\n" +
    "                        </g>\r" +
    "\n" +
    "                    </g>\r" +
    "\n" +
    "                </svg>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"closePopUpBtn\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"login\" ng-controller=\"userController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <img src=\"../../css/images/logo.png\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span class=\"facebook\" translate=\"FACEBOOK_SIGN_IN\" data-ng-click=\"singWithFacebook()\"></span>\r" +
    "\n" +
    "            <label class=\"or {{ message._class }} center\">\r" +
    "\n" +
    "                {{message.text}}\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-view a-hint=\"{{'User_name' | translate}}\"\r" +
    "\n" +
    "                          a-do-not-show-info=\"true\"\r" +
    "\n" +
    "                          a-star=\"false\"\r" +
    "\n" +
    "                          sec-model=\"loginUser.loginUser\"\r" +
    "\n" +
    "                          sec-require=\"mainCtrl.getRequire('User_name')\">\r" +
    "\n" +
    "                </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-view a-hint=\"{{'Password' | translate}}\"\r" +
    "\n" +
    "                          a-do-not-show-info=\"true\"\r" +
    "\n" +
    "                          a-star=\"false\"\r" +
    "\n" +
    "                          a-type=\"password\"\r" +
    "\n" +
    "                          sec-model=\"loginUser.loginPassword\"\r" +
    "\n" +
    "                          sec-require=\"mainCtrl.getRequire('Password')\">\r" +
    "\n" +
    "                </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-view a-hint=\"{{'Email' | translate}}\"\r" +
    "\n" +
    "                          a-do-not-show-info=\"true\"\r" +
    "\n" +
    "                          a-star=\"false\"\r" +
    "\n" +
    "                          ng-show=\"mainCtrl.config.emailAddressInLogin\"\r" +
    "\n" +
    "                          sec-disable-validation=\"!mainCtrl.config.emailAddressInLogin\"\r" +
    "\n" +
    "                          sec-model=\"loginUser.email\">\r" +
    "\n" +
    "                </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"left option \" style=\"top: 20px\">\r" +
    "\n" +
    "                    <input type=\"checkbox\" ng-model=\"mainCtrl.rememberMe\">\r" +
    "\n" +
    "                    <span translate=\"REMEMBER_ME\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-sender class=\"roboto-medium\" a-value=\"{{'SIGN_IN' | translate}}\"\r" +
    "\n" +
    "                            sec-send=\"signIn(loginUser, mainCtrl.rememberMe)\"></sec-sender>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label class=\"forgot-Passwowd\" translate=\"FORGOT_PASSWORD\"\r" +
    "\n" +
    "                   data-ng-click=\"forgotPassword()\"></label>\r" +
    "\n" +
    "            <label class=\"create-new-account\" translate=\"CREATE_NEW_ACCOUNT\"\r" +
    "\n" +
    "                   data-ng-click=\"createNewAccount()\"></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/order/partials/order-payment-success.html',
    "<div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <h2> <span class=\"roboto-regular\" translate=\"Thank_you_for_buying_with_Advantage\"> </span> </h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p class=\"roboto-regular\"> {{ 'Yor_tracking_number_is' | translate }} {{ trackingNumber }}\r" +
    "\n" +
    "        <span class=\"separator\">|</span>\r" +
    "\n" +
    "        {{ 'Your_order_number_is' | translate }} {{orderNumber}}\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <div class=\"seccion\">\r" +
    "\n" +
    "            <span translate=\"Shipping_to\"> </span>\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <div class=\"innerSeccion\">\r" +
    "\n" +
    "                    <div icon-user ></div>\r" +
    "\n" +
    "                    <label>{{user.firstName}} {{user.lastName}}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"innerSeccion\">\r" +
    "\n" +
    "                    <div icon-home ></div>\r" +
    "\n" +
    "                    <label>{{ user.address }}</label>\r" +
    "\n" +
    "                    <label>{{ user.cityName }}</label>\r" +
    "\n" +
    "                    <label>{{ user.stateProvince }}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"innerSeccion\">\r" +
    "\n" +
    "                    <div icon-phone ></div>\r" +
    "\n" +
    "                    <label>{{ user.phoneNumber }}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"seccion\">\r" +
    "\n" +
    "            <span translate=\"Payment_Method\"></span>\r" +
    "\n" +
    "            <div class=\"innerSeccion\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    {{TransPaymentMethod}}\r" +
    "\n" +
    "                    <a class=\"floater\" data-ng-show=\"TransPaymentMethod == 'MasterCredit'\">\r" +
    "\n" +
    "                        <span data-ng-repeat=\"_4numbers in cardNumber track by $index\" >\r" +
    "\n" +
    "                            {{ _4numbers | showLast4DigitsCard:$last:$index }}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"innerSeccion\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    {{ 'Date_Ordered' | translate}}\r" +
    "\n" +
    "                    <a class=\"floater\">{{Date_Ordered}}</a>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"seccion\">\r" +
    "\n" +
    "            <span translate=\"Order_Summary\"></span>\r" +
    "\n" +
    "            <div class=\"innerSeccion\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    {{ 'Subtotal' | translate}}\r" +
    "\n" +
    "                    <a class=\"floater\"> {{ subTotal | currency:$ }} </a>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"innerSeccion\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    {{ 'shipping' | translate}}\r" +
    "\n" +
    "                    <a class=\"floater\"> {{shippingCost | currency:'$'}}</a>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"innerSeccion\">\r" +
    "\n" +
    "                <label class=\"total\">\r" +
    "\n" +
    "                    {{ 'TOTAL' | translate}}\r" +
    "\n" +
    "                    <a class=\"floater\">  {{ total | currency:$ }} </a>\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/order/partials/user-are-login.html',
    "<div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"detailslink\">\r" +
    "\n" +
    "        <label class=\"roboto-regular\" ng-class=\"{ selected : firstTag }\">1. {{ mainCtrl.config.spellingMistakes ? 'SHIPING_DETAILS' : 'SHIPPING_DETAILS' | translate}} </label>\r" +
    "\n" +
    "        <label class=\"roboto-regular\" ng-class=\"{ selected : !firstTag }\">2. {{ 'PAYMENT_METHOD' | translate }}</label>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- USER DETAILS SECTION-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"userSection\" ng-show=\"firstTag\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div data-ng-show=\"!userDetailsEditMode\">\r" +
    "\n" +
    "            <div id=\"userDetails\">\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <img src=\"css/images/User.jpg\" alt=\"user\">\r" +
    "\n" +
    "                    <!--<div icon-user></div>-->\r" +
    "\n" +
    "                    <label>{{user.firstName}} {{user.lastName}}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <!--<img src=\"css/images/.jpg\" alt=\"user\">-->\r" +
    "\n" +
    "                    <div icon-home></div>\r" +
    "\n" +
    "                    <label data-ng-show=\"user.address != ''\">{{ user.address }}</label>\r" +
    "\n" +
    "                    <label data-ng-show=\"user.cityName != ''\">{{ user.cityName }}</label>\r" +
    "\n" +
    "                    <label data-ng-show=\"country.name != ''\">{{ country.name }}</label>\r" +
    "\n" +
    "                    <label data-ng-show=\"user.stateProvince != ''\">{{ user.stateProvince }}</label>\r" +
    "\n" +
    "                    <label data-ng-show=\"user.zipcode != ''\">{{ user.zipcode }}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <div icon-phone></div>\r" +
    "\n" +
    "                    <label>{{ user.phoneNumber }}</label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"blueLink\">\r" +
    "\n" +
    "                <a data-ng-click=\"setUserDetailsEditMode()\"\r" +
    "\n" +
    "                   translate=\"Edit_shipping_Details\"></a>\r" +
    "\n" +
    "                <label class=\"float-button\">{{ 'SHIPPING_BY' | translate }}:\r" +
    "\n" +
    "                    <img src=\"css/images/Shipex.png\" alt=\"ShipEx\"/></label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"mobileBtnHandler\">\r" +
    "\n" +
    "                <button data-ng-click=\"shippingDetails_next()\" class=\"a-button nextBtn marginTop75\" translate=\"NEXT\">\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div data-ng-show=\"userDetailsEditMode\" id=\"userDetailsEditMode\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- EDIT USER DETAILS SECTION-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <sec-form sec-get-form-validation-when-ready=\"validSecValidate(valid)\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <h6 class=\"roboto-bold\"> {{ mainCtrl.config.spellingMistakes ? 'Reciever_Details' : 'Receiver_Details' | translate}} </h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"spliter\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'First_Name' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.firstName\"\r" +
    "\n" +
    "                              sec-min-length=\"mainCtrl.getMin(2)\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(30)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'Last_Name' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.lastName\"\r" +
    "\n" +
    "                              sec-min-length=\"mainCtrl.getMin(2)\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(30)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"spliter\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'Phone_Number' | translate}}\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(20)\"\r" +
    "\n" +
    "                              sec-model=\"user.phoneNumber\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <h6 translate=\"Address\" class=\"roboto-bold\"></h6>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"spliter\">\r" +
    "\n" +
    "                    <sec-view a-hint=\"Country\"\r" +
    "\n" +
    "                              sec-require=\"mainCtrl.getRequire('Country')\"\r" +
    "\n" +
    "                              a-type=\"select\"\r" +
    "\n" +
    "                              a-show=\"name\"\r" +
    "\n" +
    "                              sec-model=\"country\"\r" +
    "\n" +
    "                              sec-select-options=\"countries\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{ mainCtrl.config.spellingMistakes ? 'Ciity' : 'City' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.cityName\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(25)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"spliter\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'Address' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.address\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(50)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'Postal_Code' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.zipcode\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(10)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"spliter\">\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'State__Province__Region' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"user.stateProvince\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(10)\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"option marginTop\">\r" +
    "\n" +
    "                    <input ng-model=\"agree_Agreement\" type=\"checkbox\"/>\r" +
    "\n" +
    "                    <span class=\"roboto-light\" translate=\"Save_changes_in_profile_for_future_use\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"blueLink\">\r" +
    "\n" +
    "                    <sec-sender class=\"roboto-medium\"\r" +
    "\n" +
    "                                a-value=\"{{'NEXT' | translate}}\"\r" +
    "\n" +
    "                                sec-send=\"accountUpdate()\">\r" +
    "\n" +
    "                    </sec-sender>\r" +
    "\n" +
    "                    <a class=\"roboto-medium float-button a-link linkToPress\"\r" +
    "\n" +
    "                       data-ng-class=\"{ buttonDisable : invalidUser}\"\r" +
    "\n" +
    "                       data-ng-click=\"backToMainShippingDetails()\" translate=\"BACK\">\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- END EDIT USER DETAILS SECTION-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- END USER DETAILS SECTION-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- EDIT EDIT PAYMENT SECTION -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"paymentMethod\" data-ng-hide=\"firstTag\">\r" +
    "\n" +
    "        <div>\r" +
    "\n" +
    "            <label class=\"Choose_payment roboto-medium\" translate=\"Choose_payment_method_below\">\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <div class=\"paymentMethods\">\r" +
    "\n" +
    "                <div class=\"imgRadioButton\" data-ng-click=\"imgRadioButtonClicked(1)\"\r" +
    "\n" +
    "                     data-ng-class=\"{ selected : imgRadioButton == 1 }\">\r" +
    "\n" +
    "                    <img src=\"css/images/SafePay.png\" alt=\"Safepay\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"imgRadioButton\" data-ng-click=\"imgRadioButton = 2\"\r" +
    "\n" +
    "                     data-ng-class=\"{ selected : imgRadioButton == 2 }\">\r" +
    "\n" +
    "                    <img src=\"css/images/Master_credit.png\" alt=\"Master credit\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!---------------------------- SAFEPAY SECCION ---------------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-show=\"imgRadioButton == 1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"notice\">\r" +
    "\n" +
    "                    <h4 translate=\"Notice\"></h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <p class=\"roboto-light\">{{ 'This_is_a_demo' | translate }} {{ 'Please_enter_a_fake_data' |\r" +
    "\n" +
    "                        translate }}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-form >\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'SafePay_User_name' | translate}}\"\r" +
    "\n" +
    "                              sec-model=\"savePay.username\"\r" +
    "\n" +
    "                              sec-require=\"mainCtrl.getRequire('SafePay_User_name')\"\r" +
    "\n" +
    "                              sec-min-length=\"mainCtrl.getMin(5)\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(15)\"\r" +
    "\n" +
    "                              sec-pattern=\"mainCtrl.getPattern('Username')\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <sec-view a-hint=\"{{'SafePay_Password' | translate}}\"\r" +
    "\n" +
    "                              a-type=\"password\"\r" +
    "\n" +
    "                              sec-model=\"savePay.password\"\r" +
    "\n" +
    "                              sec-require=\"mainCtrl.getRequire('SafePay_Password')\"\r" +
    "\n" +
    "                              sec-min-length=\"mainCtrl.getMin(4)\"\r" +
    "\n" +
    "                              sec-max-length=\"mainCtrl.getMax(12)\"\r" +
    "\n" +
    "                              sec-pattern=\"mainCtrl.getPattern('Password')\">\r" +
    "\n" +
    "                    </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"option marginTop\">\r" +
    "\n" +
    "                        <input ng-model=\"saveSafePay\" type=\"checkbox\">\r" +
    "\n" +
    "                        <span class=\"roboto-light ng-binding\" translate=\"Save_changes_in_profile_for_future_use\"> </span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"blueLink margin15px\">\r" +
    "\n" +
    "                        <a data-ng-click=\"Back_to_shipping_details()\" translate=\"Back_to_shipping_details\"></a>\r" +
    "\n" +
    "                        <!--<a data-ng-click=\"firstTag = true\" translate=\"Back_to_shipping_details\"></a>-->\r" +
    "\n" +
    "                        <label class=\"float_right\">\r" +
    "\n" +
    "                            <sec-sender class=\"roboto-medium\" a-value=\"{{'PAY_NOW' | translate}}\"\r" +
    "\n" +
    "                                        sec-send=\"payNow_SafePay()\"></sec-sender>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-------------------------- END SAFEPAY SECCION -------------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-------------------------- MASTERCREDIT SECCION --------------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-show=\"imgRadioButton == 2 && !noCards && !showMasterCart\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"masterCreditSeccion\">\r" +
    "\n" +
    "                    <div class=\"roboto-regular\">\r" +
    "\n" +
    "                        <span class=\"MasterCredit\">MasterCredit</span>\r" +
    "\n" +
    "                        <span data-ng-repeat=\"_4numbers in CardNumber track by $index\">\r" +
    "\n" +
    "                            {{ _4numbers | showLast4DigitsCard:$last:$index}}\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                        <label class=\"edit \" data-ng-click=\"toggleShowMasterCart()\" translate=\"Edit\">\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"blueLink marginBottom\">\r" +
    "\n" +
    "                    <a ng-click=\"Back_to_shipping_details()\" translate=\"Back_to_shipping_details\"></a>\r" +
    "\n" +
    "                    <label>\r" +
    "\n" +
    "                        <button class=\"roboto-medium float-button a-button\" data-ng-click=\"payNow_manual()\">\r" +
    "\n" +
    "                            {{'PAY_NOW' | translate}}\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-------------------------- END MASTERCREDIT SECCION --------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!---------------------------- MANUAL PAYMENT SECCION ---------------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-show=\"(imgRadioButton == 2) && (noCards || showMasterCart)\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"notice\">\r" +
    "\n" +
    "                    <h4 translate=\"Notice\"></h4>\r" +
    "\n" +
    "                    <p class=\"roboto-light\">{{ 'This_is_a_demo' | translate }} {{ 'Please_enter_a_fake_data' | translate }}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"spliter\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <sec-view a-hint=\"{{'Card_number' | translate}}\"\r" +
    "\n" +
    "                                  a-secret-field=\"true\"\r" +
    "\n" +
    "                                  sec-model=\"card.number\"\r" +
    "\n" +
    "                                  sec-require=\"mainCtrl.getRequire('Card_number')\"\r" +
    "\n" +
    "                                  sec-card-number=\"mainCtrl.getCardNumber(16)\">\r" +
    "\n" +
    "                        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <sec-view a-hint=\"{{'CCV_Number' | translate}}\" class=\"creditCard\"\r" +
    "\n" +
    "                                  a-secret-field=\"true\"\r" +
    "\n" +
    "                                  sec-model=\"card.cvv\"\r" +
    "\n" +
    "                                  sec-require=\"mainCtrl.getRequire('CCV_Number')\"\r" +
    "\n" +
    "                                  sec-pattern=\"mainCtrl.getPattern('CCV_Number')\">\r" +
    "\n" +
    "                        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <label class=\"roboto-regular expiration_date_title\" translate=\"Expiration_Date\"></label>\r" +
    "\n" +
    "                    <div class=\"spliter\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"payment_date\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <sec-view a-hint=\"{{ 'MM' | translate }}\"\r" +
    "\n" +
    "                                      a-type=\"select\"\r" +
    "\n" +
    "                                      a-do-not-show-info=\"true\"\r" +
    "\n" +
    "                                      sec-require=\"mainCtrl.getRequire('Month')\"\r" +
    "\n" +
    "                                      sec-model=\"card.expirationDate.month\"\r" +
    "\n" +
    "                                      sec-select-options=\"month\"\r" +
    "\n" +
    "                            >\r" +
    "\n" +
    "                            </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <sec-view a-hint=\"{{ 'YY' | translate }}\"\r" +
    "\n" +
    "                                      a-type=\"select\"\r" +
    "\n" +
    "                                      a-do-not-show-info=\"true\"\r" +
    "\n" +
    "                                      sec-require=\"mainCtrl.getRequire('Year')\"\r" +
    "\n" +
    "                                      sec-model=\"card.expirationDate.year\"\r" +
    "\n" +
    "                                      sec-select-change=\"calculateMonths(value)\"\r" +
    "\n" +
    "                                      sec-select-options=\"years\">\r" +
    "\n" +
    "                            </sec-view>\r" +
    "\n" +
    "                            <!--sec-value-change=\"\"-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <sec-view a-hint=\"{{ 'Cartholder_Name' | translate }}\"\r" +
    "\n" +
    "                                  sec-require=\"mainCtrl.getRequire('Cartholder_Name')\"\r" +
    "\n" +
    "                                  sec-model=\"card.name\">\r" +
    "\n" +
    "                        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"option marginTop\">\r" +
    "\n" +
    "                        <input ng-model=\"saveMasterCredit\" type=\"checkbox\" class=\"ng-pristine ng-untouched ng-valid\">\r" +
    "\n" +
    "                        <span class=\"roboto-light ng-binding\" translate=\"Save_changes_in_profile_for_future_use\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"blueLink\">\r" +
    "\n" +
    "                        <a ng-click=\"Back_to_shipping_details()\" translate=\"Back_to_shipping_details\"></a>\r" +
    "\n" +
    "                        <label>\r" +
    "\n" +
    "                            <sec-sender class=\"roboto-medium\" a-value=\"{{'PAY_NOW' | translate}}\"\r" +
    "\n" +
    "                                        sec-send=\"payNow_masterCredit()\"></sec-sender>\r" +
    "\n" +
    "                        </label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!---------------------------- END MANUAL PAYMENT SECCION ---------------------------->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- END EDIT PAYMENT SECTION-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/order/partials/user-not-login.html',
    "<div>\r" +
    "\n" +
    "<!--<h5 class=\"roboto-regular bigPadding\" translate=\"IDENTIFICATION\"></h5>-->\r" +
    "\n" +
    "<div class=\"noUserSection\">\r" +
    "\n" +
    "    <label class=\"roboto-medium\" translate=\"Already_have_an_account\" ></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <sec-form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <sec-view a-hint=\"{{'User_name' | translate}}\"\r" +
    "\n" +
    "                  a-star=\"false\"\r" +
    "\n" +
    "                  sec-model=\"orderPaymenLogin.loginUser\"\r" +
    "\n" +
    "                  sec-require=\"mainCtrl.getRequire('User_name')\"\r" +
    "\n" +
    "                  sec-min-length=\"mainCtrl.getMin(5)\"\r" +
    "\n" +
    "                  sec-max-length=\"mainCtrl.getMax(15)\"\r" +
    "\n" +
    "                  sec-pattern=\"mainCtrl.getPattern('Username')\">\r" +
    "\n" +
    "        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--sec-pattern=\"((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{0,12})\" pattern-error-attr=\"Use_up_to_12_characters_Include_at_least_one_letter_and_one_number\"-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <sec-view a-hint=\"{{'Password' | translate}}\"\r" +
    "\n" +
    "                  a-star=\"false\"\r" +
    "\n" +
    "                  a-type=\"password\"\r" +
    "\n" +
    "                  sec-model=\"orderPaymenLogin.loginPassword\"\r" +
    "\n" +
    "                  sec-require=\"mainCtrl.getRequire('Password')\"\r" +
    "\n" +
    "                  sec-min-length=\"mainCtrl.getMin(4)\"\r" +
    "\n" +
    "                  sec-max-length=\"mainCtrl.getMax(12)\"\r" +
    "\n" +
    "                  sec-pattern=\"mainCtrl.getPattern('Password')\">\r" +
    "\n" +
    "        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <sec-view a-hint=\"{{'Email' | translate}}\"\r" +
    "\n" +
    "                  a-star=\"false\"\r" +
    "\n" +
    "                  ng-show=\"config.emailAddressInLogin\"\r" +
    "\n" +
    "                  sec-model=\"orderPaymenLogin.email\"\r" +
    "\n" +
    "                  sec-disable-validation=\"!config.emailAddressInLogin\"\r" +
    "\n" +
    "                  sec-require=\"mainCtrl.getRequire('Email')\"\r" +
    "\n" +
    "                  sec-pattern=\"mainCtrl.getPattern('Email')\">\r" +
    "\n" +
    "        </sec-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <label translate=\"Forgot_your_password\"\r" +
    "\n" +
    "               class=\"roboto-regular\"\r" +
    "\n" +
    "               id=\"Forgot_your_password\">\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <br />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <sec-sender class=\"roboto-medium\" a-value=\"{{'LOGIN' | translate}}\"\r" +
    "\n" +
    "                    sec-send=\"orderPaymenLogin_signIn()\"></sec-sender>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <br />\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <label ng-class=\"{ invalid : rsMessage._class == 'invalid' }\" > {{ rsMessage.text }}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </sec-form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div id=\"newClient\" class=\"noUserSection .noUserLogin\">\r" +
    "\n" +
    "    <div class=\"cover\">\r" +
    "\n" +
    "        <div data-ng-class=\"{ noEmail : !config.emailAddressInLogin }\">\r" +
    "\n" +
    "            <label class=\"roboto-medium\" translate=\"New_client\" ></label>\r" +
    "\n" +
    "            <p translate=\"Create_your_account_easily\"></p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <a href=\"#/register\" class=\"a-button roboto-medium\"\r" +
    "\n" +
    "           data-ng-class=\"{ buttonDisable : invalidItems.length > 0 }\" translate=\"REGISTRATION\">\r" +
    "\n" +
    "        </a>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/account/partials/a.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h1></h1>"
  );
                            });                            return templates;                        });