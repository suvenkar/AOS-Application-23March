/**
 * Created by correnti on 04/02/2016.
 */


define(['./module'], function (directives) {
    'use strict';
    directives.directive('virtualFooter', function () {
        return {
            link: function (s, e) {
                e.css({
                    display: 'block',
                    position: 'relative',
                });

                e.attr("id", "virtualFooter")
                $(document).ready(function () {
                    $(window).resize(Helper.footerHandler);
                    setTimeout(Helper.footerHandler(), 100);
                })
            }
        };
    });
});


