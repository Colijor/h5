var headUrl_ = "";
var nickName_ = "";
var goldNum_ = "";
var openId_ = "";
var boxId_ = "";

$(function() {
	$.get(serverUrl + "/members/get/user?boxNumber=", function(data) {	
						
		if (data.code == 1) {
			window.location.href = "/h5/login.html";
			//window.location.href = "/com.hdiandian.platfrom.web/h5/login.html";
		}
		
		if(data.code == 2){											
			headUrl_ = data.data.headimgurl;
			nickName_ = data.data.userName;
			goldNum_ = data.data.mxb;
			openId_ = data.data.wechatId;
			boxId_ = data.data.boxId;
			
			if($(".tx img")){
				$(".tx img").attr("src",headUrl_);
			}
			$(".xinxi span:nth-child(1)").html(nickName_);
			$(".xinxi span:nth-child(3)").html(goldNum_ );
			if(openId_ && openId_ != ""){
				$(".shouquan .tiaozhuan").html("已授权");	
			}
		}
		
	});
});
