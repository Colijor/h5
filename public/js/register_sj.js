$(function() {
	var test = {
		node : null,
		count : 60,
		start : function() {
			// console.log(this.count);
			if (this.count > 0) {
				this.node.innerHTML = this.count--;
				var _this = this;
				setTimeout(function() {
					_this.start();
				}, 1000);
			} else {
				this.node.removeAttribute("disabled");
				this.node.innerHTML = "再次发送";
				this.count = 60;
			}
		},
		// 初始化
		init : function(node) {
			this.node = node;
			this.node.setAttribute("disabled", true);
			this.start();
		}
	};

	var btn = document.getElementById("Verification_Code");
	btn.onclick = function() {
		var mobile = $("#mobile").val();
		if(mobile == null || mobile == ""){
			alert("手机号码不能为空");
			return;
		}else if(mobile.length != 11){
			alert("手机号码格式错误");
			return;
		}else{
			alert("验证信息会发送到" + mobile);
			test.init(btn);

			$.get(serverUrl + "/sms/get/sms?mobile=" + $("#mobile").val(), function(data) {
				// alert(data);
			});
		}
	};

	$("#fh").attr("href", "login.html" + $.getGameUrlParam());
	
	$("input[type='hidden']").attr("value", $.getUrlParam("boxNumber"));

	$('.mui-input-group').bind("submit", function() {
		var options = {
			url : serverUrl + '/members/add/members',
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
			}
		};
		$.ajax(options);
		return false;
	})

	$("#register").click(function() {
		var mobile = $("#mobile").val();
		var code = $("#code").val();
		var pwd = $("#password").val();
		var newpwd = $("#newPassword").val();

		if (mobile == null || mobile == "") {
			alert("手机号不能为空");
			return;
		}
		if (isNaN(mobile) || mobile.length != 11) {
			alert("手机号码必须为数字并且为11位");
			return;
		}

		if (code == null || code == "") {
			alert("验证码不能为空");
			return;
		}

		if (pwd == null || pwd == "") {
			alert("密码不能为空");
			return;
		}

		if (newpwd == null || newpwd == "") {
			alert("确认密码不能为空");
			return;
		}
		if (newpwd != pwd) {
			alert("两次输入的密码不一致，请重新输入");
			return;
		}

		$('.mui-input-group').submit();
	})
});					  