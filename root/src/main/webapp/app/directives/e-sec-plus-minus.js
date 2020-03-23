/**
 * Created by correnti on 27/12/2015.
 */



define(['./module'], function (directives) {
    'use strict';
    directives
        .directive('eSecPlusMinus', ['$templateCache', function ($templateCache) {
            return {
                restrict: 'E',
                template: $templateCache.get('app/partials/e-sec-plus-minus.html'),
                scope: {
                    numAttr: '=',
                    updateProductAttr: '&',
                    aDisable: '=',
                    maxValue: '=',
                },
                controller: ['$scope', function (s) {

                    var maxValue = 999;
                    var minValue = 1;
                    var num = 1;
                    var readyToCheck = true;
                    var ctrl = this;
                    s.numAttr = parseInt(s.numAttr);

                    this.setNewNum = function (_num) {
                        num = parseInt(_num);
                    }

                    this.incrementNumAttr = function () {
                        if (s.numAttr > minValue) {
                            s.numAttr--;
                        }
                    };

                    this.decrementNumAttr = function () {
                        s.numAttr++;
                    };

                    this.getMaxValue = function () {
                        return maxValue;
                    }

                    this.setMaxValue = function (_maxValue) {
                        maxValue = _maxValue;
                    }

                    this.getMinValue = function () {
                        return minValue;
                    }

                    s.incrementValue = function () {
                        s.$apply(function () {
                            var newVal = s.numAttr + 1
                            num = s.numAttr = parseInt(newVal);
                        });

                        s.updateProductAttr()
                        return s.numAttr >= maxValue;
                    }

                    s.decrementValue = function () {
                        s.$apply(function () {
                            var newVal = s.numAttr - 1
                            num = s.numAttr = parseInt(newVal);
                            s.updateProductAttr()
                        });
                        return s.numAttr <= minValue;
                    }

                    this.saveNumber = function ($event) {

                        if (!checkNumber($event)) {
                            return false;
                        }

                        if (readyToCheck) {
                            readyToCheck = false;
                            num = s.numAttr;
                        }
                        return true;
                    }

                    this.updateNumber = function (allowEmpty) {
                        readyToCheck = true;
                        s.updateProductAttr()
                        s.checkDisables(allowEmpty)
                    }

                    function checkNumber() {

                        if ((s.numAttr + "").length == 0) {
                            return true;
                        }

                        var isNumber = (s.numAttr - 0) == s.numAttr && ('' + s.numAttr).trim().length > 0;

                        if (!isNumber /*|| (s.numAttr + "").length == (ctrl.getMaxValue() + "").length*/) {
                            return false;
                        }
                        if (s.numAttr > maxValue || s.numAttr < minValue) {
                            s.numAttr = parseInt(num);
                            return false;
                        }
                        return true;
                    }
                }],
                link: function (s, e, a, ctrl) {

                    e.addClass("sec-plus-minus")
                    if (s.aDisable) {
                        e.addClass("sec-plus-minus-disable")
                    }

                    if (s.maxValue) {
                        ctrl.setMaxValue(s.maxValue);
                    }


                    var minValue = ctrl.getMinValue();
                    var maxValue = ctrl.getMaxValue();
                    if (s.numAttr <= minValue) {
                        s.numAttr = parseInt(minValue);
                        $(e).find('.minus').addClass('disableBtn')
                    }
                    if (s.numAttr >= maxValue) {
                        s.numAttr = maxValue;
                        $(e).find('.plus').addClass('disableBtn')
                    }

                    s.checkDisables = function (allowEmpty) {
                        if (s.numAttr <= minValue) {
                            if (s.numAttr == "" && allowEmpty) {
                            }
                            else {
                                s.numAttr = parseInt(minValue);
                            }
                            $(e).find('.minus').addClass('disableBtn')
                            $(e).find('.plus').removeClass('disableBtn')
                        }
                        else {
                            $(e).find('.minus').removeClass('disableBtn')
                        }

                        if (s.numAttr >= maxValue) {
                            s.numAttr = parseInt(maxValue);
                            $(e).find('.plus').addClass('disableBtn')
                            $(e).find('.minus').removeClass('disableBtn')
                        }
                        else {
                            $(e).find('.plus').removeClass('disableBtn')
                        }
                        if ((s.numAttr - 0) == s.numAttr && ('' + s.numAttr).trim().length > 0) {
                            s.numAttr = parseInt(s.numAttr);
                        }
                    }
                }
            }
        }])
        .directive('numbersOnly', function () {
            return {
                restrict: 'A',
                require: '^eSecPlusMinus',
                link: function (s, e, a, ctrl) {

                    e.on('click', function ($event) {
                            this.select();
                        }
                    );

                    s.$watch('numAttr', function () {
                        ctrl.updateNumber(true);
                    });

                    e.on('keydown', function ($event) {
                        s.$apply(function () {
                            switch ($event.keyCode) {
                                case 38:
                                    ctrl.incrementNumAttr();
                                    $event.preventDefault();
                                    break;
                                case 40:
                                    ctrl.decrementNumAttr();
                                    $event.preventDefault();
                                    break;
                            }
                        });
                    });

                    e.on('blur', function () {
                        s.$apply(function () {
                            ctrl.updateNumber(false);
                        })
                    });
                }
            }
        })
        .directive('incrementValueAttr', function () {
            return {
                restrict: 'A',
                require: '^eSecPlusMinus',
                link: function (s, e, a, ctrl) {

                    e.on('click', function () {

                        if (a.incrementValueAttr == "+") {

                            if (e.hasClass("disableBtn")) {
                                return;
                            }
                            if (s.incrementValue()) {
                                e.addClass("disableBtn")
                                return;
                            }
                            $(e).siblings('.minus').removeClass("disableBtn")
                            e.removeClass("disableBtn")

                        }
                        if (a.incrementValueAttr == "-") {

                            if (e.hasClass("disableBtn")) {
                                return;
                            }
                            if (s.decrementValue()) {
                                e.addClass("disableBtn")
                                return;
                            }
                            $(e).siblings('.plus').removeClass("disableBtn")
                            e.removeClass("disableBtn")
                        }
                    });
                }
            }
        })
    ;


});

