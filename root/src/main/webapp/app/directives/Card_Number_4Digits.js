/**
 * Created by correnti on 18/01/2016.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('cardNumberFourDigits', function(){
        return{
            restrict: 'A',

            link: function(s, e, a, ctrl){
                if(s.card && s.card.number && s.card.number.length > 0 ){
                    e.addClass('Card_Number_4Digits');
                }
                var input = $(e).find('.inputtext');
                $(input).on({
                    focus: function () {
                        if(e.hasClass('Card_Number_4Digits'))
                        {return;}
                        e.addClass('Card_Number_4Digits');
                    },
                    blur: function(){
                        if($(this).val() != '')
                        {return;}
                        e.removeClass('Card_Number_4Digits');
                    }
                });
            }
        }
    });
});
