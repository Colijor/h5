$(document).ready(function(e){
	/*调试手机屏幕大小*/
	var deviceAgent = navigator.userAgent.toLowerCase();
	/*判断苹果机*/
	if (deviceAgent.match(/(iphone)/)) {				
		/*alert(window.screen.height);*/
		
		if(window.screen.height==667){
			/*苹果6跟苹果7一样大*/
			$("#container").css("height", "667px");/*游戏抽奖界面*/
			$("#container_lp").css("height", "667px");/*轮盘首界面*/
			$("#container_czsm").css("height", "667px");/*轮盘操作界面*/
			$("#container_yxgz").css("height", "667px");/*轮盘游戏规则界面*/
			$("#container_xn").css("height", "667px");/*小鸟游戏界面*/
			$(".about_contanir").css("height", "667px"); /*关于我们*/
			$(".mui-content").css("height", "667px");    /*登录界面*/
			$(".personal_Center_container").css("height", "667px"); /*个人中心*/
			$(".payment_container").css("height", "667px"); /*充值界面*/
			$(".home_contanir").css("height", "667px");  /*首页*/
			$(".shuluma_contanir").css("height", "667px");  /*屏幕码界面*/
			$(".recharge_contanir").css("height", "667px");  /*充值记录界面*/
			$(".prizes_contanir").css("height", "667px");  /*我的奖品界面*/
			$(".receive_prize_contanir").css("height", "667px");  /*奖品领取界面*/
			$(".about_contanir").css("height", "667px");  /*我的头像界面*/
			$(".sryxBody").css("height", "667px");  /*杀人游戏界面*/
		} 
		if(window.screen.height==736){
			/*苹果6plus*/
			$("#container").css("height", "736px");
			$("#container_lp").css("height", "736px");
			$("#container_czsm").css("height", "736px");
			$("#container_yxgz").css("height", "736px");
			$("#container_xn").css("height", "736px");
			$(".about_contanir").css("height", "736px");
			$(".mui-content").css("height", "736px");
			$(".personal_Center_container").css("height", "736px");
			$(".payment_container").css("height", "736px");
			$(".home_contanir").css("height", "736px");
			$(".shuluma_contanir").css("height", "736px");
			$(".recharge_contanir").css("height", "736px");
			$(".prizes_contanir").css("height", "736px");
			$(".receive_prize_contanir").css("height", "736px");
			$(".about_contanir").css("height", "736px");
			$(".sryxBody").css("height", "736px");
		}
		if(window.screen.height==568){
			/*苹果5*/
			$("#container").css("height", "530px");
			$("#container_lp").css("height", "530px");
			$("#container_czsm").css("height", "736px");
			$("#container_yxgz").css("height", "736px");
			$("#container_xn").css("height", "568px");
			$(".about_contanir").css("height", "568px");
			$(".mui-content").css("height", "568px");
			$(".personal_Center_container").css("height", "568px");
			$(".payment_container").css("height", "568px");
			$(".home_contanir").css("height", "530px");
			$(".shuluma_contanir").css("height", "530px");
			$(".recharge_contanir").css("height", "530px");
			$(".prizes_contanir").css("height", "530px");
			$(".receive_prize_contanir").css("height", "530px");
			$(".about_contanir").css("height", "530px");
			$(".sryxBody").css("height", "530px");
		}
		
	}
	/*判断安卓机*/
	if(deviceAgent.match(/(android)/)){
		// alert(window.screen.height);
		if(window.screen.height==699){
			/*小米5splus*/
			$("#container").css("height", "699px");
			$("#container_lp").css("height", "699px");
			$("#container_czsm").css("height", "699px");
			$("#container_yxgz").css("height", "699px");
			$("#container_xn").css("height", "699px");
			$(".about_contanir").css("height", "699px");
			$(".mui-content").css("height", "699px");
			$(".personal_Center_container").css("height", "699px");
			$(".payment_container").css("height", "699px");
			$(".home_contanir").css("height", "699px");
			$(".shuluma_contanir").css("height", "699px");
			$(".recharge_contanir").css("height", "699px");
			$(".prizes_contanir").css("height", "699px");
			$(".receive_prize_contanir").css("height", "699px");
			$(".about_contanir").css("height", "699px");
			$(".sryxBody").css("height", "699px");
		}
		if(window.screen.height==640){
			$("#container").css("height", "640px");
			$("#container_lp").css("height", "640px");
			$("#container_czsm").css("height", "640px");
			$("#container_yxgz").css("height", "640px");
			$("#container_xn").css("height", "640px");
			$(".about_contanir").css("height", "640px");
			$(".mui-content").css("height", "640px");
			$(".personal_Center_container").css("height", "640px");
			$(".payment_container").css("height", "640px");
			$(".home_contanir").css("height", "640px");
			$(".shuluma_contanir").css("height", "640px");
			$(".recharge_contanir").css("height", "640px");
			$(".prizes_contanir").css("height", "640px");
			$(".receive_prize_contanir").css("height", "640px");
			$(".about_contanir").css("height", "640px");
			$(".sryxBody").css("height", "640px");
		}
		if(window.screen.height==620){
			$("#container").css("height", "620px");
			$("#container_lp").css("height", "620px");
			$("#container_czsm").css("height", "620px");
			$("#container_yxgz").css("height", "620px");
			$("#container_xn").css("height", "620px");
			$(".about_contanir").css("height", "620px");
			$(".mui-content").css("height", "620px");
			$(".personal_Center_container").css("height", "620px");
			$(".payment_container").css("height", "620px");
			$(".home_contanir").css("height", "620px");
			$(".shuluma_contanir").css("height", "620px");
			$(".recharge_contanir").css("height", "620px");
			$(".prizes_contanir").css("height", "620px");
			$(".receive_prize_contanir").css("height", "620px");
			$(".about_contanir").css("height", "620px");
			$(".sryxBody").css("height", "620px");
		}
		if(window.screen.height==732){
			$("#container").css("height", "730px");
			$("#container_lp").css("height", "730px");
			$("#container_czsm").css("height", "730px");
			$("#container_yxgz").css("height", "730px");
			$("#container_xn").css("height", "730px");
			$(".about_contanir").css("height", "730px");
			$(".mui-content").css("height", "730px");
			$(".personal_Center_container").css("height", "730px");
			$(".payment_container").css("height", "730px");
			$(".home_contanir").css("height", "730px");
			$(".shuluma_contanir").css("height", "730px");
			$(".recharge_contanir").css("height", "730px");
			$(".prizes_contanir").css("height", "730px");
			$(".receive_prize_contanir").css("height", "730px");
			$(".about_contanir").css("height", "730px");
			$(".sryxBody").css("height", "730px");
		}				
	}
});





