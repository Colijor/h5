$(function() {
	//ajax注入权限验证 
	$.ajax({
		//与服务器交互
		url : serverUrl + "/wxScan/get/weixinScan",
		type : "post",
		dataType : 'json',
		contentType : "application/json; charset=utf-8",
		data : '{"weburl":"' + window.location.href + '"}',
		complete : function(XMLHttpRequest, textStatus) {

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("发生错误：" + errorThrown);
		},
		success : function(res) {
			var appId = res.appId;
			var noncestr = res.nonceStr;
			var jsapi_ticket = res.jsapi_ticket;
			var timestamp = res.timestamp;
			var signature = res.signature;

			wx.config({
				debug : false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。 
				appId : appId, //必填，公众号的唯一标识 
				timestamp : timestamp, // 必填，生成签名的时间戳 
				nonceStr : noncestr, //必填，生成签名的随机串 
				signature : signature,// 必填，签名，见附录1 
				jsApiList : [ 'checkJsApi', 'scanQRCode' ]
			//必填，需要使用的JS接口列表，所有JS接口列表 见附录2 
			});
		}
	});

	wx.error(function(res) {
		alert("出错了：" + res.errMsg);
	});
	
	$('.ho_sao').click(function() {
		wx.scanQRCode({
			needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果， 
			scanType : [ "qrCode", "barCode" ], // 可以指定扫二维码还是一维码，默认二者都有 
			success : function(res) {
				var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果 
				//document.getElementById("wm_id").value = result; //将扫描的结果赋予到jsp对应值上 
				//alert("扫描成功::扫描码=" + result);
				window.location.href = result;		
			}
		});
	});
});
