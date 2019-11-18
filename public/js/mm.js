$(function() {
	$("#lj").attr("href", "register.html" + $.getGameUrlParam());
	$("#forgetPassword").attr("href", "forget_password.html" + $.getGameUrlParam());

	$("input[type='hidden']").attr("value", $.getUrlParam("boxNumber"));
	
	$('.mui-input-group').bind("submit",function() {
		var options = {
			url :'http://192.168.0.200/members/get/logon',
			type : 'post',
			dataType : 'json',
			contentType : "application/json; charset=utf-8",
			data : DataDeal.formToJson($(".mui-input-group").serialize()),
			success : function(data) {
				//alert(data.code);
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
});