$(function(){			
	/*点击“退出登陆”按钮则退出到登录界面*/
	$(".tc_button").click(function(){
		localStorage.removeItem("boxNumber"); 
		localStorage.removeItem("gameUrl"); 
		//location.href="/h5/login.html";
		WeixinJSBridge.call('closeWindow');
	});	
	
	/*点击不同div跳转不同的界面*/
	
	/*充值记录*/
	$('.jilv').click(function() {	
	    location.href="/h5/recharge.html";
	});
	
	/*我的奖品*/
	$('.jiangpin').click(function() {	
	    location.href="/h5/prizes.html";	    
	});
	
	/*关于我们*/
	$('.guanyu').click(function() {	
	    location.href="/h5/about.html";
	});
	
	$('#per_fh').click(function() {	
		var gameUrl = localStorage.getItem("gameUrl"); 
		var boxNumber = localStorage.getItem("boxNumber"); 
		if((!gameUrl || gameUrl == null || gameUrl == 'null') && (boxNumber && boxNumber != null && boxNumber != 'null')){
			window.location.href = serverUrl + "/h5/game_cj.html?gameUrl="+serverUrl+"/h5/game_cj.html&boxNumber=" + boxNumber;
		}else if(gameUrl && gameUrl != null && gameUrl != 'null' && boxNumber && boxNumber != null && boxNumber != 'null'){
			window.location.href = gameUrl + "?gameUrl="+gameUrl+"&boxNumber=" + boxNumber;
		}
	});
	
});

function pay(){
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/payment.html&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
		//var url='http://'+serverIp+'/h5/payment.html';
		location.href = url;
		
	}else{
		alert("请在微信客户端充值");
	}
}


function paySq() {
	if(openId_ && openId_ != ""){
		if(confirm("确定取消微信一键登录？")) {
			$.ajax({
				url: serverUrl + "/members/update/wechatId",
				type: "post",
				dataType: "json",
				contentType : "application/json; charset=utf-8",
				success: function(data) {
					if(data.code == 0){
						alert("取消一键登录成功");
						$(".shouquan .tiaozhuan").html("未授权");
						openId_ = "";
					} else{
						alert(date.msg);
					}
				}
			});
		}
	}else{
		var na = window.navigator.userAgent.toLowerCase();
		if (na.match(/MicroMessenger/i) == 'micromessenger') {
			var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/personal_Center.html&response_type=code&scope=snsapi_userinfo&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
			location.href = url;
										
		}else{
			alert("请在微信客户端打开");
		}
	}
}

$(function() {
	var code = $.getUrlParam("code");
	if (code == null || code == "") {
		//alert("code参数为空");
	} else {
		$.ajax({
			url: serverUrl + "/members/add/wechatId",
			type: "post",
			dataType: "json",
			contentType : "application/json; charset=utf-8",
			data: '{"code":"'+ $.getUrlParam("code")+'"}',
			success: function(data) {
				if (data.code == 4 || data.code == 5){
					alert(data.msg);
				}else if(data.code == 3){
					alert("请用微信打开");
				}else if(data.code == 0){
					alert("授权成功");
					$(".shouquan .tiaozhuan").html("已授权");
					openId_ = "true";
				} else{
					alert("系统错误");
				}
			}
		});
	}
});

