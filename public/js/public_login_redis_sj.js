var headUrl_ = "";
var nickName_ = "";
var goldNum_ = "";
var boxId_ = "";
var serverIp = "";
var token = "";
var userId = "";

var gameUrl_ = window.location.href;
var boxNumber = $.getUrlParam('boxNumber')==null ||  $.getUrlParam('boxNumber')=="" ||  $.getUrlParam('boxNumber') == "null" ? $.getUrlParam("state"):$.getUrlParam('boxNumber');

getInitData();
$(function() {
     initUserInfo();
     var path = window.location.pathname;
     var url = window.location.search;
     console.log("URL is " + url);
     if(path == '/h5/game_lp.html'){
	console.log("Egret is Not Starting");
     }else {
	console.log("Egret is Starting");
	egret.runEgret({ renderMode: "webgl", audioType: 0 });
     }

	
});

function toMiniProgram(){
	console.log('To MiniProgram...');
	var userId = localStorage.getItem("userId");
	wx.miniProgram.navigateTo({url:'/pages/wdfx/chongzhi/chongzhi?userId=' + userId})
}


function initUserInfo(){
    if($(".touxiang img")){
        $(".touxiang img").attr("src",headUrl_);
        $(".touxiang span:nth-child(2)").html(nickName_);
        $(".touxiang span:nth-child(3)").html(goldNum_ );
    }
    if($(".tx img")){
        $(".tx img").attr("src",headUrl_);
    }

    if($(".xinxi")){
        $(".xinxi span:nth-child(1)").html(nickName_);
        $(".xinxi span:nth-child(3)").html(goldNum_ );
    }
}

function getInitData(){
    console.log('boxNumber = ' + boxNumber);
    $.ajax({
        url : serverUrl + "/members/get/loginByWechatOfRedis",
	type : "post",
        dataType:"json",
        data:{"boxNumber":boxNumber,"code":$.getUrlParam("code")},
        async : false,//取消异步
        success : function(data){
            if (data.code == 1) {
                alert(data.msg);
            }else if(data.code == 3){//微信授权失败
		console.log("data.data.type == 3");
		console.log(na);
                var na = window.navigator.userAgent.toLowerCase();
                if (na.match(/MicroMessenger/i) == 'micromessenger') {
		    console.log('Get QQ OAuth2.0');
    		    var encodeUrl = encodeURIComponent(gameUrl_);
                    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId +  '&redirect_uri=' + encodeUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
                    location.href = url;
                }else{
		    console.log('Please Open on WeChat');
                    alert("请在微信客户端打开");
		                   }
            }else if (data.code == 0) {
                if( data.data.type == 2){
		    console.log("data.data.type == 2");
                    if ($.getCurUrl() != ("https://game.hdiandian.com/h5/game_qh.html") || $.getCurUrl() != ("http://game.hdiandian.com/h5/game_qh.html")) {
                        console.log("dataType=2,$.getCurUrl != game_qh.html");
                        window.location.href = "https://game.hdiandian.com/h5/game_qh.html" + $.getGameParam();
                    }
                }else if(data.data.type == 1){
                    if ($.getCurUrl() == ("https://game.hdiandian.com/h5/game_qh.html") || $.getCurUrl() == ("http://game.hdiandian.com/h5/game_qh.html")) {
                        console.log("dataType=1,$.getCurUrl = game_qh.html");
                        window.location.href = "https://game.hdiandian.com/h5/game_cj.html" + $.getGameParam();
                    }
                    headUrl_ = data.data.headimgurl;
					headUrl_ = headUrl_.replace("http","https");
                    localStorage.setItem("headUrl", headUrl_);
                    nickName_ = data.data.userName;
                    localStorage.setItem("userName", nickName_);
                    goldNum_ = data.data.mxb;
                    boxId_ = data.data.boxId;
                    serverIp = data.data.serverIp;
                    token = data.data.token;
                    localStorage.setItem("boxNumber", boxId_);
                    localStorage.setItem("goldNum", goldNum_);

		            userId = data.data.userId;
		            localStorage.setItem("userId",userId);
                }
            }
        }
    });
}