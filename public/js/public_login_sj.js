var headUrl_ = "";
var nickName_ = "";
var goldNum_ = "";
var boxId_ = "";
var gameUrl_ = "";

gameUrl_ = $.getCurUrl();
var boxNumber = $.getUrlParam('boxNumber')==null ||  $.getUrlParam('boxNumber')=="" ||  $.getUrlParam('boxNumber') == "null" ? $.getUrlParam("state"):$.getUrlParam('boxNumber');
var code = $.getUrlParam("code");

$.ajax({
    url : serverUrl + "/members/get/loginByWechat?boxNumber=" + boxNumber+"&code="+$.getUrlParam('code'),
    type : "get",
    dataType:"json",
    async : false,//取消异步
    success : function(data){
        if (data.code == 1) {
            alert(data.msg);
        }else if(data.code == 3){
            var na = window.navigator.userAgent.toLowerCase();
            if (na.match(/MicroMessenger/i) == 'micromessenger') {
                var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId +  '&redirect_uri=' + gameUrl_ + '&response_type=code&scope=snsapi_userinfo&state='+boxNumber+'&connect_redirect=1#wechat_redirect';
                location.href = url;
            }else{
                alert("请在微信客户端打开");
		
            }
        }else if (data.code == 2) {
            headUrl_ = data.data.headimgurl;
            nickName_ = data.data.userName;
            goldNum_ = data.data.mxb;
            boxId_ = data.data.boxId;

        } else if (data.code == 0) {
            if( data.data.type == 2){
                if ($.getCurUrl() != (serverUrl + "/h5/game_qh.html")) {
                    window.location.href = serverUrl + "/h5/game_qh.html" + $.getGameParam();
                }
            }else if(data.data.type == 1){
                if ($.getCurUrl() == (serverUrl + "/h5/game_qh.html")) {
                    window.location.href = "/h5/game_cj.html" + $.getGameParam();
                }
                headUrl_ = data.data.headimgurl;
                nickName_ = data.data.userName;
                goldNum_ = data.data.mxb;
                boxId_ = data.data.boxId;
                localStorage.setItem("boxNumber", boxId_);

            }
        }
    }
});
$(function() {
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
});
