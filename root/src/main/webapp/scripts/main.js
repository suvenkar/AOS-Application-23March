/**
 * Created by correnti on 16/11/2015.
 */

$(document).on({

    ready: function() {

        // Mobile section handler
        var mobile_section_moved = $("#mobile-section").width();
        $("#mobile-section").css("left", "-" + $("#mobile-section").css("width"));

        //$("#mobile-btn").click(function () {
        //    Helper.mobileSectionHandler();
        //});

        // end Mobile section handler


        function _resize() {
            console.log($(window).scrollTop())
            $("#mobile-section").height($(window).height() + "px");
        }
        _resize();

        $(window).on({
            resize: _resize,
        });

        $('#product_search_img').click(function (e) {
            $('#product_search').css("display", "inline-block");
            $('#product_search').animate({ "width": $('#product_search').width() > 0 ? 0 : "150px" }, 500, function(){
                if($('#product_search').width() == 0 ){
                    $(this).css("display", "none");
                }
            } );
        });


    },
});

