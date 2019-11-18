$(document).ready(function(){
	/*调试手机屏幕大小*/
	var deviceAgent = navigator.userAgent.toLowerCase();
	//判断苹果机
	if (deviceAgent.match(/(iphone)/)) {				
		//alert(window.screen.height);
		
		if(window.screen.height==667){
			//苹果6跟苹果7一样大
			$("#container").css("height", "667px");
		}
		if(window.screen.height==736){
			//苹果6plus
			$("#container").css("height", "736px");
		}
		if(window.screen.height==568){
			//苹果5
			$("#container").css("height", "568px");
		}
		
	}
	//判断安卓机
	if(deviceAgent.match(/(android)/)){
		//alert(window.screen.height);
		if(window.screen.height==699){
			//小米5splus
			$("#container").css("height", "699px");
		}
		if(window.screen.height==640){					
			$("#container").css("height", "640px");
		}
		if(window.screen.height==620){					
			$("#container").css("height", "620px");
		}
		if(window.screen.height==732){					
			$("#container").css("height", "730px");
		}				
	}
			
	
	$('#lunpan').click(function(){ 	
		init();
		$("#lunpan").addClass('1');
 		$('#lunpan img').attr({"src":"/h5/public/image/g_01_1.png","style":"width:230px"});
	});
	$('#buyu').click(function(){
		init();
		$("#buyu").addClass('1');
 		$('#buyu img').attr({"src":"/h5/public/image/g_02_1.png","style":"width:230px"});
	});
	$('#xiaoniao').click(function(){
		init();
		$("#xiaoniao").addClass('1');
 		$('#xiaoniao img').attr({"src":"/h5/public/image/g_03_1.png","style":"width:230px"});
	});
	$('#choujiang').click(function(){
		init();
		$("#choujiang").addClass('1');
 		$('#choujiang img').attr({"src":"/h5/public/image/g_04_1.png","style":"width:230px"});
	});	
	$('#langren').click(function(){
		init();
		$("#langren").addClass('1');
 		$('#langren img').attr({"src":"/h5/public/image/g_05_1.png","style":"width:230px"});
	});	
	$('#tanke').click(function(){
		init();
		$("#tanke").addClass('1');
 		$('#tanke img').attr({"src":"/h5/public/image/g_06_1.png","style":"width:230px"});
	});	
	$("#tuichu").click(function(){
		window.location.href = "/h5/login.html" + $.getGameParam();
	});
	
	function init(){
		$("#lunpan").removeClass("1");
		$("#buyu").removeClass("1");
		$("#xiaoniao").removeClass("1");
		$("#choujiang").removeClass("1");	
		$("#langren").removeClass('1');
		$("#tanke").removeClass('1');
 		$('#lunpan img').attr({"src":"/h5/public/image/g_01.png","style":"width:220px"});
 		$('#buyu img').attr({"src":"/h5/public/image/g_02.png","style":"width:220px"});
 		$('#xiaoniao img').attr({"src":"/h5/public/image/g_03.png","style":"width:220px"});
 		$('#choujiang img').attr({"src":"/h5/public/image/g_04.png","style":"width:220px"});
 		$('#langren img').attr({"src":"/h5/public/image/g_05.png","style":"width:230px"});
 		$('#tanke img').attr({"src":"/h5/public/image/g_06.png","style":"width:230px"});
	}
});

/*判断屏幕的横屏，还是竖屏*/
(function rotate(){
   var orientation=window.orientation;
   if(orientation==90||orientation==-90){
   	
      document.body.style.display='none';
      alert("为方便使用，请使用竖屏访问！，请把选择页面选择锁定竖屏");
   }
   window.onorientationchange=function(){
      document.body.style.display="block";
      rotate();
   };
})()

var boxNumber = $.getUrlParam('boxNumber');
var boxIp = $.getUrlParam('boxIp');
var data="";
$(function(){
	/*确定按钮*/
	$("#queding").click(function(){				
		var lunpan=$("#lunpan").attr("class");
		var buyu=$("#buyu").attr("class");
		var xiaoniao=$("#xiaoniao").attr("class");
		var choujiang=$("#choujiang").attr("class");		
		var langren=$("#langren").attr("class");	
		var tanke=$("#tanke").attr("class");				
						
		if(lunpan == '1'){							
			data="1";
		}else if(buyu == '1'){
			data="2";									
		}else if(xiaoniao == '1'){
			data="3";										
		}else if(choujiang == '1'){
			data="4";
		}else if(langren == '1'){
			data="5";
		}else if(tanke == '1'){
			data="6";
		}else{
			alert("请选择游戏！");
			return false;
		}															
	});  			
});
  		
var ws = null;
 function WebSocketInit(){
    if ("WebSocket" in window){                         
       ws = new WebSocket(serverWs);
	   //ws = new WebSocket("ws://192.168.8.103:8989/live");
		
       ws.onopen = function(){
			var boxNumber = $.getUrlParam('boxNumber');
			if (boxNumber && boxNumber != null) {
				ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"GameCenter_Init_Player"}');
			} else {
				alert("网络不好，请退出重新扫码！");
			}
       };
		
       ws.onmessage = function (evt){ 
			var data = evt.data;
			var obj = eval('(' + data + ')');//将字符串转换成JSON
			if (obj.type == 'message') {
				
			} else if(obj.type == 'login') {
				window.location.href = "/h5/login.html" + $.getGameParam();
			}
       };
		
       ws.onclose = function(){ 
          // 关闭 websocket
			ws = null;
       };
    }else{
       // 浏览器不支持 WebSocket
       alert("您的浏览器不支持 WebSocket!");
    }
 }      
WebSocketInit();
function WebSocketTest() {
	if(ws == null) {
		WebSocketInit();
	}
	var boxNumber = $.getUrlParam('boxNumber');
	if (boxNumber && boxNumber != null) {
		ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"GameCenter_Enter_Game","_msg_object_str":{\"_game_index\":' + data + '}}');
	} else {
		alert("网络不好，请退出重新扫码！");
	}
}