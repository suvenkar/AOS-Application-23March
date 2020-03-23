/**
 * Created by correnti on 17/11/2015.
 */


var Slider = Slider || {};

Slider.AddSliderListener = function(){

    var ____moveSlider = setInterval(moveSlider, 10000)
    var delayAnim04 = "delayAnim01 ";
    var bounceOutRight ='animated bounceOutRight ', bounceInLeft = 'animated bounceInLeft ';
    var bounceInRight ='animated bounceInRight ', bounceOutLeft ='animated bounceOutLeft ';
    var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    $(window).on({ resize: _resize });

    $(document).on("click", ".slider-steps > span", function(a){
        clearInterval(____moveSlider);

        var lastSelected = $(".slider-steps span.selected").index();
        $(".slider-steps span").removeClass("selected");
        $(".slider-steps span").css({
            "border":  $(this).index() == 1 ? "solid black 1px" : "solid white 1px",
            "background-color": "transparent",
        });
        $(this).css({"background-color":  $(this).index() == 1 ? "black" : "white",});
        $(this).addClass("selected");


        /* Animate h2 & Button */
        if(lastSelected > $(this).index()){

            $(".slider-length div:nth-child("+(lastSelected + 1)+") .container h2").addClass(bounceOutRight)
                .one(animEnd, function(){ $(this).removeClass(bounceOutRight); });
            $(".slider-length div:nth-child("+(lastSelected + 1)+") .container button").addClass(bounceOutRight + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceOutRight + delayAnim04); });

            $(".slider-length div:nth-child("+($(this).index() + 1)+") .container h2").addClass(bounceInLeft)
                .one(animEnd, function(){ $(this).removeClass(bounceInLeft); });
            $(".slider-length div:nth-child("+($(this).index() + 1)+") .container button").addClass(bounceInLeft + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceInLeft + delayAnim04); });
        }
        else{

            $(".slider-length div:nth-child("+($(this).index())+") .container h2").addClass(bounceOutLeft)
                .one(animEnd, function(){ $(this).removeClass(bounceOutLeft); });
            $(".slider-length div:nth-child("+($(this).index())+") .container button").addClass(bounceOutLeft + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceOutLeft + delayAnim04); });

            $(".slider-length div:nth-child("+($(this).index() + 1)+") .container h2").addClass(bounceInRight)
                .one(animEnd, function(){ $(this).removeClass(bounceInRight); });
            $(".slider-length div:nth-child("+($(this).index() + 1)+") .container button").addClass(bounceInRight + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceInRight + delayAnim04); });
        }
        /* --------------- end Animate h2 & Button  ---------------*/



        /* Move Slider */
        $(".slider-length").css({
            "right" : ($(this).index()) * parseInt($(window).width()) + "px"
        });
        /* --------------- Move Slider ---------------*/

        setTimeout(function(){
            ____moveSlider = setInterval(moveSlider, 10000);
        }, 500);
    });



    function moveSlider()
    {
        try{
            if($(".slider-length").length == 0){ clearInterval(____moveSlider);return; }


            /* Build Object */
            var objProps = {};
            objProps.length = $(".slider-length").width();
            objProps._windowsLength = $(window).width();
            objProps.int_right = parseInt($(".slider-length").css("right").replace("px", ""));
            objProps.spans = $(".slider-steps span");
            objProps.nth_child = (objProps.int_right / objProps._windowsLength) + 1;

            objProps.index = objProps.int_right == 0 ? 0
                : (objProps.int_right / objProps._windowsLength) == objProps.spans.length - 1 ? -1
                : objProps.int_right / objProps._windowsLength;
            objProps.index++;
            /* --------------- end Build Object ---------------*/






            /* Update UI */
            $(objProps.spans).removeClass("selected");
            $(".slider-steps span").css({ "border":  objProps.index == 1 ? "solid black 1px" : "solid white 1px", "background-color": "transparent", });
            $($(".slider-steps span")[objProps.index]).css({"background-color":  objProps.index == 1 ? "black" : "white",});
            $(objProps.spans[objProps.index]).addClass("selected");
            /* --------------- Update UI ---------------*/




            /* Animate h2 & Button */
            $(".slider-length div:nth-child("+(objProps.nth_child)+") .container h2").addClass(bounceOutLeft)
                .one(animEnd, function(){ $(this).removeClass(bounceOutLeft); });
            $(".slider-length div:nth-child("+(objProps.nth_child)+") .container button").addClass(bounceOutLeft + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceOutLeft + delayAnim04); });

            $(".slider-length div:nth-child("+(objProps.nth_child + 1)+") .container h2").addClass(bounceInRight)
                .one(animEnd, function(){ $(this).removeClass(bounceInRight); });
            $(".slider-length div:nth-child("+(objProps.nth_child + 1)+") .container button").addClass(bounceInRight + delayAnim04)
                .one(animEnd, function(){ $(this).removeClass(bounceInRight + delayAnim04); });
            /* --------------- end Animate h2 & Button  ---------------*/



            $(".slider-length").css("right",  (objProps.int_right) + parseInt(objProps._windowsLength) + "px");

            /* Checking if is the last Frame  */
            var moveTo = (parseInt($(".slider-length").stop().css("right").replace("px", "")) + (parseInt(objProps._windowsLength) *2));
            if (objProps.length < moveTo) {
                $(".slider-length").removeClass("transition");
                $(".slider-length").css("right", "0px");
                setTimeout(function(){
                    $(".slider-length").addClass("transition");
                    moveSlider();
                }, 100)
            }
            /* --------------- end  Checking if is the last Frame  ---------------*/

        }
        catch(e){
            clearInterval(____moveSlider);
        }
    }



    function _resize() {
        $(".slider-length").css("right", "0px");
        var spans = $(".slider-steps span");
        $(spans).removeClass("selected");
        $(spans[0]).addClass("selected");
    }




}












