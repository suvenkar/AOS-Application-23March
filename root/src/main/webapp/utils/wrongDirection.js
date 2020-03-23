/**
 * Created by correnti on 19/11/2015.
 */



$(document).ready(function(){
    _resize();
    $(window).resize(_resize)
    function _resize(){

       // console.log($("#pageNotFound").length());
        if($(this).width() < 900)
        {
            $("#pageNotFound").attr("src", "../../css/images/Under_construction_320.jpg")
            return;
        }
        $("#pageNotFound").attr("src", "../../css/images/Under_construction.jpg")

        //console.log($("#Under_construction").length());
        if($(this).width() < 900)
        {
            $("#Under_construction").attr("src", "../../css/images/Under_construction_320.jpg")
            return;
        }
        $("#Under_construction").attr("src", "../../css/images/Under_construction.jpg")

    }
});