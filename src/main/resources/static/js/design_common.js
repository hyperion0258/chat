"use strict";


var $window = $(window);
var es_step = 'Expo.ease';
var es_st1 =  'Power2.easeOut';
var es_pw1 =  'Power1.easeOut';

$(document).ready(function(){
    var wh = $(window).height();
    
    $('.HeartAnimation').on('click', function(){
        $(this).addClass('on');
        setTimeout(removeC, 800);
    });
    function removeC(){
        $('.HeartAnimation.on').removeClass('on');
    }
    $('.player_inner').height(wh);
    $(window).resize(function(){
        var rwh = $(window).height();
        $('.player_inner').height(rwh);
    });
    
    $('#file-input').on('change', function(){
        const file = this.files[0];
        if(file){
            let reader = new FileReader();
            reader.onload = function(data){
                $('#image-preview').attr('src', data.target.result);
            }
            reader.readAsDataURL(file);
        }
    }); 

    $('#file-input2').on('change', function(){
        const file = this.files[0];
        if(file){
            let reader = new FileReader();
            reader.onload = function(data){
                $('#image-preview2').attr('src', data.target.result);
            }
            reader.readAsDataURL(file);
        }
    }); 

    $('.gp_tits a').on('click', function(){
        $('.gp_tits a.on').removeClass('on');
        $(this).addClass('on');
        var idx = $(this).index();
        $('.gp_desc > div.on').removeClass('on');
        $('.gp_desc > div').eq(idx).addClass('on');
    });



    //graph01();
    //graph02();
    controller();
    startLive();
    select();
    sound();
    chat();
    
      
});


$( function() {
    $( ".datepicker" ).datepicker({ 
        dateFormat: 'yy-mm-dd' 
    }).datepicker("setDate","0");
} );

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
// 마이크 컨트롤러
function controller(){
    var vall = $('#pi_input').val(); 
    $('#pi_input').on('input', function( ) {
        $(this).css( 'background', 'linear-gradient(to right, #fff 0%, #fff '+this.value +'%, rgba(255, 255, 255, 0.2) ' + this.value + '%, rgba(255, 255, 255, 0.2) 100%)' );
        if( this.value == 0){
            $('.ip-speak').addClass('min');
        }else{
            $('.ip-speak').removeClass('min');
        }
        vall = this.value
    });

    $('.blind.ip-speak').on('click', function(){
        if( $(this).hasClass('min') == 1 ){
            $(this).removeClass('min');
            $('#pi_input').val(vall);  
            $('#pi_input').css( 'background', 'linear-gradient(to right, #fff 0%, #fff '+ vall +'%, rgba(255, 255, 255, 0.2) ' + vall + '%, rgba(255, 255, 255, 0.2) 100%)' );
        }else{
            $(this).addClass('min');
            $('#pi_input').val('0');
            $('#pi_input').css( 'background', 'linear-gradient(to right, #fff 0%, #fff '+ 0 +'%, rgba(255, 255, 255, 0.2) ' + 0 + '%, rgba(255, 255, 255, 0.2) 100%)' );
        }
    });

    $('#micinput').on('input', function( ) {
        $(this).css( 'background', 'linear-gradient(to right, #063451 0%, #063451 '+this.value +'%, rgba(215, 215, 215, 1) ' + this.value + '%, rgba(215, 215, 215, 1) 100%)' );
      
    });

    $('#micinput').on('change', function(){
        var micv1 = $(this).val();
        $('#micinputl span').width( micv1 + '%');
    });

   
}
// 라이브 시작 버튼
function startLive(){
    $('.start_btn').on('click', function(){
        if( $(this).hasClass('end') == 1 ){
            $(this).removeClass('end');
            $(this).children('a').text('라이브 시작');
        }else{
            $(this).addClass('end');
            $(this).children('a').text('라이브 종료');
        }
    });
}
// 커스텀 셀렉트
function select(){
    $('.select-cusotm .selected').on('click', function(){
      
        $('.select-cusotm.open .dropdown').not( $(this).parents('.select-cusotm.open .dropdown') ).hide();
        $('.select-cusotm.open').not( $(this).parents('.select-cusotm.open') ).removeClass('open');
     
        if( $(this).parents('.select-cusotm').hasClass('open') == 1 ){
            
            $(this).parents('.select-cusotm').removeClass('open');
            $(this).next('.dropdown').hide();

        }else{
            $(this).parents('.select-cusotm').addClass('open');
            $(this).next('.dropdown').show();
        }
       
    });

    $(document).on('click', '.dropdown a', function(){
        var seltext = $(this).html();
    
        if( $(this).hasClass('dis') == 1 ){
            return;
        }else{
            $(this).parents('.dropdown').find('.sel').removeClass('sel');
            $(this).addClass('sel');
            $(this).parents('.dropdown').prev('.selected').html(seltext);
        }

        $(this).parents('.dropdown').hide();
        $(this).parents('.select-cusotm').removeClass('open');
        
        
    });
    $(document).on('click', '.list-dropdown a', function(){
        
        var seltext = $(this).html();

        
      
        $(this).parents('.list-dropdown').prev('.selected').html(seltext);
    
        $(this).parents('.list-dropdown').hide();
        $(this).parents('.list-cusotm').removeClass('open');
        
        
    });
}

// 소리 on/off
function sound(){
    $('.blind.sound').on('click', function(){
        if( $(this).hasClass('off') == 1 ){
            $(this).removeClass('off');
        }else{
            $(this).addClass('off');
        }
    });
}

// 채팅창
function chat(){
    $('.blind.chat').on('click', function(){
        if( $(this).hasClass('on') == 1 ){
            $('.prd_info').show();
            $('.screenInfo .textbox_input').hide();
            $(this).removeClass('on')
        }else{
            $('.prd_info').hide();
            $('.screenInfo .textbox_input').show();
            $(this).addClass('on')
        }
    });
}
function graph01(){ // 상세보기 링크 수
  
    var dom = document.getElementById('chart-container01');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var option;

    option = {
    title: {
        text: '상품 상세보기 링크 수',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'right'
    },
    
    series: [
        {
        name: '상품 상세보기 링크 수',
        type: 'pie',
        radius: '50%',
        data: [
            { value: 1048, name: '구매자',itemStyle:{color:"#063451"} },
            { value: 735, name: '비구매자',itemStyle:{color:"#d7d7d7"} },
            
        ],
        emphasis: {
            itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
        }
    ]
    };
  
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
    
    window.addEventListener('resize', myChart.resize);

}
function graph02(){ // 시간대별 시청자 수


    var dom = document.getElementById('chart-container02');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var option;

    option = {
    xAxis: {
        type: 'category',
        // 시간 10분단위
        data: ['10분', '20분', '30분', '40분', '50분', '60분', '70분', '80분', '90분', '100분', '110분', '120분']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        data: [
            // 참여자수 가장 많은 참여자수는 색상 다르게
            120,
            200,
            {
            value: 300,
                itemStyle: {
                    color: '#063451'
                }
            },
            150,
            80,
            70,
            110,
            130,
            70,
            110,
            130,
            130
        ],
        type: 'bar',
        itemStyle:{
            color:"#d7d7d7",
        },
        }
    ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
    window.addEventListener('resize', myChart.resize);

}