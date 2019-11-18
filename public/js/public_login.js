// var headUrl_ = "";
// var nickName_ = "";
// var goldNum_ = "123";
// var userId = "";

var gameUrl_ = window.location.href;
var boxNumber = $.getUrlParam('boxNumber')==null ||  $.getUrlParam('boxNumber')=="" ||  $.getUrlParam('boxNumber') == "null" ? $.getUrlParam("state"):$.getUrlParam('boxNumber');
var userId = $.getUrlParam('id')==null ||  $.getUrlParam('id')=="" ||  $.getUrlParam('id') == "null" ? $.getUrlParam("state"):$.getUrlParam('id');
localStorage.setItem("boxNumber", boxNumber);
localStorage.setItem("userId",userId);

$(function() {
    var path = window.location.pathname;
    var url = window.location.search;
    console.log("URL is " + url);
    if(path == '/h5/game_lp.html' || path == '/h5/game_xinlp.html' || path == '/h5/game_xinlp_noyue.html' || path == '/h5/game_sryx.html' || path == '/h5/game_sryx_free.html'){
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

