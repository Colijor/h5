$(function() {
	$("#lj").attr("href", "register.html" + $.getGameUrlParam());
	$("#forgetPassword").attr("href", "forget_password.html" + $.getGameUrlParam());

	$("input[type='hidden']").attr("value", $.getUrlParam("boxNumber"));

	$('.mui-input-group').bind("submit",function() {
		var options = {
			url : serverUrl + '/members/get/logon',
			type : 'post',
			dataType : 'json',
			contentType : "application/json; charset=utf-8",
			data : DataDeal.formToJson($(".mui-input-group").serialize()),
			success : function(data) {									
				if (data.code == 0) {																
					if(!$.getUrlParam('gameUrl') || $.getUrlParam('gameUrl') == null || $.getUrlParam('gameUrl') == "null"
							|| !$.getUrlParam('boxNumber') || $.getUrlParam('boxNumber') == null || $.getUrlParam('boxNumber') == "null"){
						window.location.href = serverUrl + "/h5/home.html";												
					} else if (data.data == 2){
						window.location.href = serverUrl + "/h5/game_qh.html" + $.getGameParam();																	
					} else {
						window.location.href = $.getUrlParam('gameUrl') + $.getGameParam();							
					}
					return;
				} else {
					alert(data.msg);
					return;
				}

//				if(confirm('是否前往领奖页面？')){
//					 //alert("确定");
//					 location.href="https://www.cardniu.com/loan/cashback/activity/out.html?userId=7MXYXYSU9M2SU78&phone=8MSUM7MM_W22M&actionWay=wdqb&shareTime=1499823424686&source_client_from=iOS&source_client_version=7.7.0&share_target=weixin&from=singlemessage&isappinstalled=1";
//					 
//				  }else{
//				  	
//				  	if (data.code == 0) {																
//						if(!$.getUrlParam('gameUrl') || $.getUrlParam('gameUrl') == null || $.getUrlParam('gameUrl') == "null"
//								|| !$.getUrlParam('boxNumber') || $.getUrlParam('boxNumber') == null || $.getUrlParam('boxNumber') == "null"){
//							window.location.href = serverUrl + "/h5/home.html";												
//						} else if (data.data == 2){
//							window.location.href = serverUrl + "/h5/game_qh.html" + $.getGameParam();																	
//						} else {
//							window.location.href = $.getUrlParam('gameUrl') + $.getGameParam();							
//						}
//						return;
//					} else {
//						alert(data.msg);
//						return;
//					}			
//				 }

			}
		};
		$.ajax(options);
		return false;
	})

	$('#login').click(function() {
		var mobile = $("#mobile").val();
		var pwd = $("#password").val();

		if (mobile == null || mobile == "") {
			alert("手机号不能为空");
			return;
		}
		if (isNaN(mobile) || mobile.length != 11) {
			alert("手机号码必须为数字并且为11位");
			return;
		}

		if (pwd == null || pwd == "") {
			alert("密码不能为空");
			return;
		}
		$('.mui-input-group').submit();
	})
	
	
	$('.wei img').click(function(){
		var na = window.navigator.userAgent.toLowerCase();
		if (na.match(/MicroMessenger/i) == 'micromessenger') {
			var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/login.html&response_type=code&scope=snsapi_userinfo&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
			var boxNumber = $.getUrlParam('boxNumber');
			var gameUrl = $.getUrlParam('gameUrl');
			localStorage.setItem("boxNumber", boxNumber); 
			localStorage.setItem("gameUrl", gameUrl); 
			location.href = url;
		}else{
			alert("请在微信客户端打开");
					}
	});
	
	var code = $.getUrlParam("code");
	if (code == null || code == "") {
		$(".wei img").click();
		//alert("code参数为空");
	} else {
		var boxNumber = localStorage.getItem("boxNumber"); 
		var gameUrl = localStorage.getItem("gameUrl"); 
		$.ajax({
			url: serverUrl + "/members/get/wechatId",
			type: "post",
			dataType: "json",
			contentType : "application/json; charset=utf-8",
			data: '{"code":"'+ $.getUrlParam("code")+'","boxNumber":"'+ boxNumber+'"}',
			success: function(data) {
				if (data.code == 4 || data.code == 2){
					alert(data.msg);
				}else if(data.code == 0){
					if(boxNumber && gameUrl && boxNumber != null && gameUrl != null && boxNumber != 'null' && gameUrl != 'null'){
						window.location.href = gameUrl + "?boxNumber=" + boxNumber + "&gameUrl=" + gameUrl;	
					} else if(!gameUrl || gameUrl == null || gameUrl == "null" || !boxNumber || boxNumber == null || boxNumber == "null"){
						window.location.href = serverUrl + "/h5/personal_Center.html";
						//window.location.href = serverUrl + "/h5/home.html";
					} else if(boxNumber){
						window.location.href = serverUrl + "/h5/game_cj.html?boxNumber=" + boxNumber + "&gameUrl="+serverUrl+"/h5/game_cj.html";
					} else if (data.data == 2){
						window.location.href = serverUrl + "/h5/game_qh.html" + $.getGameParam();		
					} else {
						window.location.href = serverUrl + "/h5/personal_Center.html";
						//window.location.href = serverUrl + "/h5/game_cj.html" + $.getGameParam() +"&gameUrl="+serverUrl+"/h5/game_cj.html";							
					}
					return;
				} else{
					alert("系统错误");
				}
			}
		});
	}
	
});