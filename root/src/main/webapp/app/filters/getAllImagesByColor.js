/**
 * Created by correnti on 11/04/2016.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('getAllImagesByColor', function(){
        return function(images, colorSelected, defaultImage) {
            var _defaultImg = undefined;
            var _abcdefImg = [];
            var imageMatches = images.filter(function(img){
                var indexSubString = img.indexOf("##");
                var currentImg = img.substring(indexSubString + 2);
                if(currentImg == defaultImage){
                    _defaultImg = img;
                    return false;
                }
                if(img.toLowerCase().indexOf(("abcdef")) != -1 || indexSubString == -1){
                    _abcdefImg.push(img);
                    return false;
                }
                var color = img.substring(0, indexSubString);
                if (colorSelected.code == color) {
                    return true;
                }
                return false;
            });
            if(imageMatches.length == 0 && imageMatches.length == 0)
            {
                imageMatches.push(defaultImage);
            }
            else if(_defaultImg){
                if(_defaultImg.toLowerCase().indexOf(("abcdef")) != -1 ||
                    colorSelected.code == _defaultImg.substring(0, _defaultImg.indexOf("##"))){
                    imageMatches.push(defaultImage);
                }
            }
            imageMatches = imageMatches.concat(_abcdefImg);
            return imageMatches;
        };
    });
});

