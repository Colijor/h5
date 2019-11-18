var serverIp = "game.hdiandian.com";
//var serverUrl = "http://" + serverIp;
var serverUrl = "https://" + serverIp;
var serverWs = "wss://" + serverIp + "/websocket.do";
var wxAppId = "wx7a57350ab518a339";

var DataDeal = {
	//将从form中通过$('#form').serialize()获取的值转成json  
	formToJson : function(data) {
		data = data.replace(/&/g, "\",\"");
		data = data.replace(/=/g, "\":\"");
		data = "{\"" + data + "\"}";
		return data;
	},
};

/*获取地址栏后面的参数*/
$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/*获取问好前面的链接地址*/
$.getCurUrl = function(name) {
	return window.location.href.substr(0, window.location.href.indexOf("?"));
}

/*获取盒子编号，盒子ip，拼接返回*/
$.getGameParam = function() {
	var boxNumber = $.getUrlParam('boxNumber');
	var boxIp = $.getUrlParam('boxIp');
	//return "?boxNumber=" + boxNumber + "&boxIp=" + boxIp;
	return "?timestamp=" + new Date().getTime() + "&boxNumber=" + boxNumber + "&boxIp=" + boxIp;
}

/*获取盒子编号，盒子ip，游戏链接地址url，拼接返回*/
$.getGameUrlParam = function() {
	var boxNumber = $.getUrlParam('boxNumber');
	var boxIp = $.getUrlParam('boxIp');
	var gameUrl = $.getUrlParam('gameUrl');
	//return "?boxNumber=" + boxNumber + "&boxIp=" + boxIp + "&gameUrl=" + gameUrl;
	return "?timestamp=" + new Date().getTime() + "&boxNumber=" + boxNumber + "&boxIp=" + boxIp + "&gameUrl=" + gameUrl;
}

/*调取$.getGameParam获得盒子编号，盒子ip，调取拼接$.getCurUrl获得获取问好前面的链接地址，然后拼接*/
$.getGameCurUrlParam = function() {
	return $.getGameParam() + "&gameUrl=" + $.getCurUrl();
}

