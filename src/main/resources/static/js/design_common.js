"use strict";


var $window = $(window);
var es_step = 'Expo.ease';
var es_st1 =  'Power2.easeOut';
var es_pw1 =  'Power1.easeOut';


function layerPopOpen(obj){// 레이어팝업 열기, obj : 해당팝업 id
	$('.layer_pop').removeClass('open');

	if($('#'+obj).length >= 1){
		$('html, body').css('overflow','hidden');
		$('#'+obj).addClass('open');
		
    }

}


function layerPopClose(obj){// 레이어팝업 닫기, obj : 해당팝업 id

    $('#'+obj).removeClass('open');

    $('html, body').css('overflow','auto');
	
}
