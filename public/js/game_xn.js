var i1=0;
var i2=0;
var i3=0;
var i4=0;
var i5=0;
var i6=0;
var count=0;
$(function(){
	
	/*头部比赛记录事件 ---开始*/		
		//向上滑动  
	    $("#main").click(function() {
	        //div标标往上移动
	        $("#div1").slideDown(130);
	    });
	        	
	    //向下滑动  
	    $(".close").click(function() {
	        //div标标往下移动
	        $("#div1").slideUp(130);
	    });         
    /*头部比赛记录事件 ---结束*/
   
   
   /*第二个界面投注事件---开始*/
	
	/*清零事件*/
	$("#qingling1").click(function(){
		i1=0;i2=0;i3=0;i4=0;i5=0;i6=0;
		count=0;
		$("#zjbjtp span").text(0);	
		$("#count").text(0);	
	});
	
    /*第二个界面投注事件---结束*/ 
        
    /*第三个界面投注事件---开始*/   	   	
    $(".beizhu").addClass("beizhu_bg"); /*备注的背景图片初始化*/
      	   	      	
    /*第三个界面投注事件---结束*/
});

/*第一个界面倒计时*/
var wait=0;
var time=0;
//timeOut();  
function timeOut(){  
    if(wait==0){
    	/*等倒计时5秒后切换到第二个界面，第一个界面就隐藏，第二个界面就显示*/
    	$("#xn_content2").show();
        $("#xn_content1").hide();
        $("#xn_content3").hide();
        /*第二个页面倒计时*/
        if($("#xn_content2").is(":visible")){
			var setTime;
			//var time=parseInt($("#xn_content2_daojishi").text());
			setTime=setInterval(function(){
			    if(time<=0){
			    	/*clearInterval：清空设置时间*/
			        clearInterval(setTime);
			        //$("#xn_content3").show();
			        //$("#xn_content2").hide();
        			//$("#xn_content1").hide(); 					
			        return;
			    }
			    time--;
			    $("#xn_content2_daojishi").text(time);
			},1000);
		}
                
        /*feedbackObj.fadeOut(100,function(){
         * 	此代码是等到倒计时为0的时候就不再倒计时，就停止在0的状态
            feedbackObj.remove();              
        }); */ 
        $('#daojishi').fadeOut(100);         
    }else{                    
        setTimeout(function(){  
            wait--;  
            $('#daojishi').text(wait);                       
            timeOut();              
        },1000)  
    }  
}  


//显示灰色 jQuery 遮罩层 
function showBg() { 	
	var bh = $("body").height(); 
	var bw = $("body").width(); 
	$("#fullbg").css({ 
		height:bh, 
		width:bw, 
		display:"block" 
	}); 
	$("#fullbg_main").show();		
}
//关闭灰色 jQuery 遮罩 
function closeBg() { 
	$("#fullbg,#fullbg_main").hide();		
}

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
function WebSocketInit() {
	if ("WebSocket" in window) {
		ws = new WebSocket(serverWs);

		ws.onopen = function() {
			var boxNumber = $.getUrlParam('boxNumber');
			if (boxNumber && boxNumber != null) {
				ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"GameCenter_Init_Player"}');
			} else {
				alert("网络不好，请退出重新扫码！");
			}
		};

		ws.onmessage = function(evt) {
			var data = evt.data;
			var obj = eval('(' + data + ')');//将字符串转换成JSON
			if (obj.type == 'message') {
				obj = eval('(' + obj.data + ')');				
				console.log(obj);	
				
				if(obj.msg && obj.msg == 31){
					//押注开始
					time=obj.leftTime;
					wait=0;
					timeOut();
        			$("#xn_content1").hide(); 
			        $("#xn_content2").show();
			        $("#xn_content3").hide();
			        
			        guiLing();/*第二个页面所有投注的金额的数字都初始化，归零*/
					
					$("#luka_value").text(0);
					$("#dalihua_value").text(0);
					$("#sitela_value").text(0);
					$("#gaofu_value").text(0);
					$("#bopi_value").text(0);
					$("#weilu_value").text(0);
			        
			        $("#zuixia").show(); //此div里面包括清零按钮跟确定金币按钮
					$("#jiesu").hide(); //点击确定金币按钮的时候，显示结果的图片，并把清零按钮跟确定金币按钮给隐藏掉
					$("#jieshu_jinbi").text(0);	
												
					touZhu(); /*调用6个投注方法 */
					
					//获得头像下面金币的值
					var xnJinBi=$(".touxiang span:nth-child(3)").html(); console.log("金币余额为" + xnJinBi);
					
					
					/*确定投注事件*/
					$("#quedingtouzhu1").click(function(){
						if(xnJinBi == 0){
							alert("请先去充值吧！");
							var ua = window.navigator.userAgent.toLowerCase();
							if (ua.match(/MicroMessenger/i) == 'micromessenger') {
								var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/payment.html&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
								location.href = url;
							}else{
								window.location.href = "./home.html";
							}
						}else{
							if($("#count").text() == 0){
								alert("请下注");											
							}else{							
								$("#zuixia").hide();
								$("#jiesu").show();
								$("#jieshu_jinbi").text(count);	
								/*当确定了投注的金币，则去掉投注的点击事件*/
								$("#zjbjtp div").unbind("click");							
							}
							
						}	
					});		
										
				} else if(obj.msg && obj.msg == 32){														
					//结果
			        $("#xn_content3").show();
			        $("#xn_content2").hide();
        			$("#xn_content1").hide();
        			
        			console.log("小鸟" + obj.bird);
        			xuntu(obj.bird); /*选择小鸟图片背景方法*/
        			
				} else if(obj.msg && obj.msg == 33){
					//准备开始
					wait=obj.leftTime;
					timeOut();
        			$("#xn_content1").show(); 
			        $("#xn_content2").hide();
			        $("#xn_content3").hide();
			        
			        guiLing();/*第二个页面所有投注的金额的数字都初始化，归零*/
					
			        $("#zuixia").show();
					$("#jiesu").hide();
					$("#jieshu_jinbi").text(0);	
				} else if(obj.msg && obj.msg == 34){
					// 待定
				} else if(obj.msg && obj.msg == 35){
					// 中奖结果										
					console.log("中奖结果对应金币" + obj.win);
					
					if(obj.win != 0){
						$(".beizhu").show();
						$(".beizhu_shui").show();
						$("#beizhu_jinbi").show();
						$("#beizhu_jinbi").text(obj.win); /*获得到对应的金币*/
																		
						$(".beizhu").removeClass("beizhu_bg beizhu_bg1 beizhu_bg2 beizhu_bg3").addClass("beizhu_bg1"); /*押对注中奖图片*/
					}else{
						$(".beizhu").show();
						$(".beizhu_shui").show();
						$("#beizhu_jinbi").show();
						$("#beizhu_jinbi").text(0); /*未中奖显示0*/
						$(".beizhu").removeClass("beizhu_bg beizhu_bg1 beizhu_bg2 beizhu_bg3").addClass("beizhu_bg2"); /*没押中图片*/	
					}
			   		
				} else if(obj.msg && obj.msg == 36){
					// {"_msg_name":"BirdHistorySYN","_msg_object_str":"{\"_from\":1,\"birds\":[3,1,2,2],\"_to\":30,\"ids\":[500005,500004,500002,500001]}"}
					/*动态添加比赛记录*/
					var str = "<table>";
					for(i = 0; i < obj.birds.length; i++){
						if(i==0){
							str+="<tr>";
						}else if(i%2==0){
							str+="</tr><tr>";	
						}
						str+="	<td>"+obj.ids[i]+"</td>";
						str+="	<td class=\"tx_bg"+obj.birds[i]+"\"></td>";
					}
					if(obj.birds.length % 2 ==0){
						str+="</tr>";
					}else{
						str+="	<td>&nbsp;</td>";
						str+="	<td>&nbsp;</td>";
						str+="</tr>";
					}
					str +="</table>";
					$("#bsjl_value").html(str);
				}
			} else if(obj.type == 'login') {
				window.location.href = "./login.html" + $.getGameCurUrlParam();
			} else if(obj.type == 'money') {
				console.log("余额" + obj.data);
				
				if(obj.data == "余额不足，请充值!") {															
					if(confirm("余额不足，前去充值？")) {
						var ua = window.navigator.userAgent.toLowerCase();
						if (ua.match(/MicroMessenger/i) == 'micromessenger') {
							var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/payment.html&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
							location.href = url;
						}else{
							window.location.href = "./home.html";
						}
					}
				} else {
					$(".touxiang span:nth-child(3)").html(obj.data);
				}
			} else if(obj.type == 'game') {
				if(obj.data == '1') {
					window.location.href = "./game_lp.html" + $.getGameParam();
				}else if(obj.data == '2') {
					//window.location.href = "/h5/game_by.html" + $.getGameParam();
					window.location.href = "/egret/index.html" + $.getGameParam();
				} else if(obj.data == '3') {
					//window.location.href = "./game_xn.html" + $.getGameParam();
				} else if(obj.data == '4') {
					window.location.href = "./game_cj.html" + $.getGameParam();
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
			//alert("连接已关闭..."); 
			ws = null;
		};
	} else {
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
		ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"MonkeyBetREQ","_msg_object_str":{\"bet\":['+$("#luka_value").text()+','+$("#dalihua_value").text()+','+$("#sitela_value").text()+','+$("#gaofu_value").text()+','+$("#bopi_value").text()+','+$("#weilu_value").text()+']}}');
	} else {
		alert("网络不好，请退出重新扫码！");
	}
}


/*调用6个投注方法 */
function touZhu(){
	$("#zjbjtp div").unbind("click");
	$("#touzhu1").unbind("click");
 	$("#touzhu1").click(function(){
		i1++;		
		$("#luka_value").text(i1);
		count+=10;
		$("#count").text(count);	
	});
	$("#touzhu2").click(function(){
		i2++;
		$("#dalihua_value").text(i2);
		count+=10;
		$("#count").text(count);	
	});
	$("#touzhu3").click(function(){
		i3++;
		$("#sitela_value").text(i3);
		count+=10;
		$("#count").text(count);	
	});
	$("#touzhu4").click(function(){
		i4++;
		$("#gaofu_value").text(i4);
		count+=10;
		$("#count").text(count);	
	});
	$("#touzhu5").click(function(){
		i5++;
		$("#bopi_value").text(i5);
		count+=10;
		$("#count").text(count);	
	});
	$("#touzhu6").click(function(){
		i6++;
		$("#weilu_value").text(i6);
		count+=10;
		$("#count").text(count);	
	});
}

/*如果是谁的头像，就显示谁获胜*/
function xuntu(data){	
	if(data == 0){
		$(".beizhu_shui").hide();		
		$("#beizhu_jinbi").hide();
		$(".beizhu").hide();
		$(".baozha").hide();	
		$(".jiangbei").hide();	
		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg0");
		
	}else {
		$(".beizhu_shui").show();		
		$("#beizhu_jinbi").show();
		$(".beizhu").show();
		$(".baozha").show();	
		$(".jiangbei").show();
		
		if($("#jieshu_jinbi").text() == 0){
			weiTouZhu(); //如果是未下注的话，提示   备注背景  跟   金币字体   显示背景--方法
		}		
		if(data == 1){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg1");
	   		/*备注图片选择背景*/
	   		
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg1");
	   	}else if(data == 2){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg2");
	   		/*备注图片选择背景*/	   		
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg2");
	   	}else if(data == 3){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg3");
	   		/*备注图片选择背景*/
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg3");
	   	}else if(data == 4){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg4");
	   		/*备注图片选择背景*/
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg4");
	   	}else if(data == 5){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg5");
	   		/*备注图片选择背景*/
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg5");
	   	}else if(data == 6){
	   		/*小鸟头像选择背景*/
	   		$(".xuantu").removeClass("xuantu_bg0 xuantu_bg1 xuantu_bg2 xuantu_bg3 xuantu_bg4 xuantu_bg5 xuantu_bg6").addClass("xuantu_bg6");
	   		/*备注图片选择背景*/
	   		$(".beizhu_shui").removeClass("beizhu_shui_bg1 beizhu_shui_bg2 beizhu_shui_bg3 beizhu_shui_bg4 beizhu_shui_bg5 beizhu_shui_bg6").addClass("beizhu_shui_bg6");
	   	}
   	}
}

/*如果是未下注的话，提示   备注背景  跟   金币字体   显示背景--方法*/
function weiTouZhu(){
	$("#beizhu_jinbi").text(0); /*未中奖显示0*/
	$(".beizhu").removeClass("beizhu_bg beizhu_bg1 beizhu_bg2 beizhu_bg3").addClass("beizhu_bg3"); /*没下注图片*/	
}

/*第二个页面所有投注的金额的数字都初始化，归零*/
function guiLing(){
	i1=0;i2=0;i3=0;i4=0;i5=0;i6=0;
	count=0;
	$("#zjbjtp span").text(0);	
	$("#count").text(0);
}




