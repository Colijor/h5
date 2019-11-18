$(document).ready(function(e) {	
      WebSocketInit();
   //向上滑动
	 $(".wanfaguize").addClass('wanfaguize1'); // 初始化时添加背景1
     $(".wanfaguize").click(function() {
     	$(this).toggleClass('wanfaguize1').toggleClass('wanfaguize2');
    	
    	/*显示灰色 jQuery 遮罩层 */
    	var bh = $("body").height();
		var bw = $("body").width(); 
		$("#fullbg").css({ 
			height:bh, 
			width:bw, 
			display:"block" 
		}); 
		$("#dialog").show(); 
		//div标标往上移动	 
		$("#tanchu").slideDown(100);	  
	});
 	
 	//向下滑动  
     $("#chachatupian").click(function() {
         //div标标往下移动
         $("#fullbg,#tanchu").hide(); 
         /*$("#tanchu").slideUp(100);*/
     });  
 	
 	//向下滑动  
     $("#guanbi").click(function() {
         //div标标往下移动
         $("#fullbg,#tanchu").hide(); 
         /*$("#tanchu").slideUp(100);*/
     });  
    
    /*第一个界面的*/    
	    /*当点击中间的开始抽奖按钮的时候，切换背景图片*/
	    $("div .btn1").addClass('bg1'); // 初始化时添加背景1
	    $("div .btn1").click(function() {
	        //$(this).toggleClass('bg1').toggleClass('bg2');
			$(this).removeClass("bg1").addClass('bg2');
	        setTimeout(function(){//3秒后返回初始化背景
			  $("div .btn1").removeClass("bg2").addClass('bg1');
			}, 3000);
			
	    });    
    /*第二个界面------结束*/
        
    /*第二个界面的 确定按钮*/   
	   	/*当点击确定按钮的时候，切换背景图片*/
	    $(".zj_queding").addClass('zj_queding_bg1'); // 初始化时添加背景1
	    $(".zj_queding").click(function() {
	        $(this).removeClass('zj_queding_bg1').addClass('zj_queding_bg2');
	        /*当点击确定的时候显示首页界面*/
	       	$("#container_shouye").show(); /*首页界面*/
	       	$("#container_sb").hide(); /*失败界面*/			
			$("#container_zj").hide(); /*中奖界面*/
			$("#divweixin").css("top","65%");
	        
	    });
    /*第二个界面的 确定按钮    结束*/
   
   	/*第二个界面的 确定按钮*/   
	   	/*当点击确定按钮的时候，切换背景图片*/
	    $(".sb_queding").addClass('sb_queding_bg1'); // 初始化时添加背景1
		$(".sb_queding").click(function() {
	        $(this).removeClass('sb_queding_bg1').addClass('sb_queding_bg2');
	        /*当点击确定的时候显示首页界面*/
       		$("#container_shouye").show(); /*首页界面*/
       		$("#container_sb").hide(); /*失败界面*/			
			$("#container_zj").hide(); /*中奖界面*/
		});
    /*第二个界面的 确定按钮    结束*/

	    $(".zj_cunru").click(function() {
	        /*当点击确定的时候显示首页界面*/
	       	$("#container_shouye").show(); /*首页界面*/
	       	$("#container_sb").hide(); /*失败界面*/			
			$("#container_zj").hide(); /*中奖界面*/
			$("#divweixin").css("top","65%");
	        
	    });

});

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

var ws = null;
/*var boxNumber = $.getUrlParam('boxNumber');
var token = $.getUrlParam('token');*/
/*var thisServerIp = window.location.href.split("/")[2];*/
var thisServerWs;
function WebSocketInit() {
	if ("WebSocket" in window) {
	    thisServerWs = "ws://" + serverIp + "/websocket.do?token="+token;
		ws = new WebSocket(thisServerWs);
		
		ws.onopen = function() {
			//var boxNumber = $.getUrlParam('boxNumber');
			//if (boxNumber && boxNumber != null) {
				ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"GameCenter_Init_Player","_msg_object_str":{ "_game_index":4}}');
			//} else {
				//alert("网络不好，请退出重新扫码！");
			//}
		};

		ws.onmessage = function(evt) {
			var data = evt.data;
			var obj = eval('(' + data + ')');//得到数据后解析json数据
			if (obj.type == 'message') {
				obj = eval('(' + obj.data + ')');
				if(obj.msg && obj.msg == 41){
					if (obj.data.data == 0) {
						//window.location.href = "./game_cj_sb.html" + $.getGameParam();
						$("#container_sb").show(); /*失败界面*/
						$("#container_shouye").hide(); /*首页界面*/
						$("#container_zj").hide(); /*中奖界面*/
						$("#divweixin").css("top","80%");
														
					} else{ /*if (obj.data == 1 || obj.data == 2 || obj.data == 3 || obj.data == 4 || obj.data == 5) {*/
						//window.location.href = "./game_cj_zj.html" + $.getGameParam() + "&data=" + obj.data;								
						$("#container_zj").show(); /*中奖界面*/
						$("#container_sb").hide(); /*失败界面*/
						$("#container_shouye").hide(); /*首页界面*/
						$("#divweixin").css("top","80%");
														
					 	if(obj.data.data == 1){
					 		$("#gxzj").text("获得一等奖");
					 	}else if(obj.data.data == 2){
					 		$("#gxzj").text("获得二等奖");
					 	}else if(obj.data.data == 3){
					 		$("#gxzj").text("获得三等奖");
					 	}else if(obj.data.data == 4){
					 		$("#gxzj").text("获得四等奖");
					 	}else if(obj.data.data == 5){
					 		$("#gxzj").text("获得五等奖");
					 	}
					 	
					 	if(obj.data.address && obj.data.address != ""){
					 		$(".zj_queding").hide();
							$(".zj_liji").show();
							$(".zj_cunru").show();
							$(".zj_liji").attr('href', obj.data.address); 
							$("#div_prizes").show();
					 	}else{
					 		//$(".zj_queding").show();
							//$(".zj_liji").hide();
							//$(".zj_cunru").hide();
					 		$(".zj_queding").hide();
							$(".zj_liji").show();
							$(".zj_cunru").show();
							$(".zj_liji").attr('href', "/h5/prizes.html");  
							$("#div_prizes").show();
					 	}
					}
				} else if(obj.msg && obj.msg == 42){
					alert(obj.data);
				} else if(obj.msg && obj.msg == 43){
					alert(obj.data);
				} else if(obj.msg && obj.msg == 44){
					alert(obj.data);
				} else if(obj.msg && obj.msg == 45){
					var active1 = obj.data.activityItemList[0].name;
					var active2 = obj.data.activityItemList[1].name;
					var active3 = obj.data.activityItemList[2].name;
					var active4 = obj.data.activityItemList[3].name;
					var active5 = obj.data.activityItemList[4].name;
					var startTime = obj.data.startTime.time;//开始时间
					var endTime = obj.data.endTime.time;//结束时间
					var expiryTime = getMyDate(obj.data.expiryTime.time);//兑奖时间
					var activetime = getMyDate(startTime)+'~'+getMyDate(endTime);//活动时间
					
					$('#li1 span').html(active1);
					$('#li2 span').html(active2);
					$('#li3 span').html(active3);
					$('#li4 span').html(active4);
					$('#li5 span').html(active5);
					$('#li6 span').html(activetime);
					$('#li7 span').html(expiryTime);
				}
			} else if(obj.type == 'login') {
				//window.location.reload();
				ws = null;
                getInitData();
                initUserInfo();
                WebSocketInit();
			} else if(obj.type == 'game') {
				if(obj.data == '1') {
					window.location.href = "/h5/game_lp.html" + $.getGameParam();
				}else if(obj.data == '2') {
					//window.location.href = "/h5/game_by.html" + $.getGameParam();
					window.location.href = "/egret/index.html" + $.getGameParam();
				} else if(obj.data == '3') {
					window.location.href = "/h5/game_xn.html" + $.getGameParam();
				} else if(obj.data == '4') {
					//window.location.href = "/h5/game_cj.html" + $.getGameParam();
				} else if(obj.data == '5') {
					window.location.href = "/h5/game_sryx.html" + $.getGameParam();
				} else if(obj.data == '6') {
					//window.location.href = "/h5/game_tk.html" + $.getGameParam();
					window.location.href = "/tank/index.html" + $.getGameParam();
				}
			}
		};
		ws.onclose = function() {
			// 关闭 websocket
			// alert("连接已关闭..."); 
			ws = null;
            getInitData();
            initUserInfo();
            WebSocketInit();
		};
	}
	else {
		alert("您的浏览器不支持 WebSocket!");
	}
}
/*$(function(){

});*/
function WebSocketTest() {
	if(ws == null) {
		WebSocketInit();
	}
	//var boxNumber = $.getUrlParam('boxNumber');
	if (boxNumber && boxNumber != null) {
		ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"LotteryREQ"}');
	} else {
		alert("网络不好，请退出重新扫码！");
	}
}

function getMyDate(strs){  
        var oDate = new Date(strs),  
        oYear = oDate.getFullYear(),  
        oMonth = oDate.getMonth()+1,  
        oDay = oDate.getDate(),  
        oTime = oYear +"年"+ getzf(oMonth) +"月"+ getzf(oDay) +"日";//最后拼接时间  
        return oTime;  
    };  
//补0操作  
function getzf(num){  
	if(parseInt(num) < 10){  
		num = '0'+num;  
	}  
	return num;  
}  
