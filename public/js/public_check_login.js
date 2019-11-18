var headUrl_ = "";
var nickName_ = "";
var goldNum_ = "";
var boxId_ = "";
var gameUrl_ = "";

$(function() {
	gameUrl_ = $.getCurUrl();
	localStorage.setItem("gameUrl", gameUrl_); 
	var boxNumber = $.getUrlParam('boxNumber');
	$.get(serverUrl + "/members/get/user?boxNumber=" + boxNumber, function(data) {
		if (data.code == 1) {
			var gameUrl = window.location.href;
			gameUrl = gameUrl.substr(0, gameUrl.indexOf("?"));
			window.location.href = "/h5/login.html" + $.getGameCurUrlParam();
		} else if (data.code == 2) {						
			headUrl_ = data.data.headimgurl;
			nickName_ = data.data.userName;
			goldNum_ = data.data.mxb;
			boxId_ = data.data.boxId;
			
			if($(".tx img")){
				$(".tx img").attr("src",headUrl_);
			}
			$(".xinxi span:nth-child(1)").html(nickName_);
			$(".xinxi span:nth-child(3)").html(goldNum_ );
			
						
		} else if (data.code == 0 && data.data && data.data.type == 2) {
			if ($.getCurUrl() != (serverUrl + "/h5/game_qh.html")) {
				window.location.href = serverUrl + "/h5/game_qh.html" + $.getGameParam();
			}
		} else if (data.code == 0 && data.data && data.data.type == 1) {
			if ($.getCurUrl() == (serverUrl + "/h5/game_qh.html")) {
				window.location.href = "/h5/game_cj.html" + $.getGameParam();
			}
			headUrl_ = data.data.headimgurl;
			nickName_ = data.data.userName;
			goldNum_ = data.data.mxb;
			boxId_ = data.data.boxId;

			localStorage.setItem("boxNumber", boxId_); 
			localStorage.setItem("gameUrl", gameUrl_); 
			
			if($(".touxiang img")){
				$(".touxiang img").attr("src",headUrl_);
				$(".touxiang span:nth-child(2)").html(nickName_);
				$(".touxiang span:nth-child(3)").html(goldNum_ );
			}
		}
		return;
	});
});
