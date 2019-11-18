$(function(){	
			
	/*点击金额 1元时触发的事件*/
	$(".money_1").click(function(){
		$(this).css("border","1px solid #FF4040");
		$(".recharge").val("1");
		
		$(".money_10").css("border","1px solid #BBBBBB");
		$(".money_10").attr("value","");
		$(".money_50").css("border","1px solid #BBBBBB");
		$(".money_50").attr("value","");
		$(".money_100").css("border","1px solid #BBBBBB");
		$(".money_100").attr("value","");
	});
	
	/*点击金额 10元时触发的事件*/
	$(".money_10").click(function(){
		$(this).css("border","1px solid #FF4040");
		$(".recharge").val("10");
		
		$(".money_1").css("border","1px solid #BBBBBB");
		$(".money_1").attr("value","");
		$(".money_50").css("border","1px solid #BBBBBB");
		$(".money_50").attr("value","");
		$(".money_100").css("border","1px solid #BBBBBB");
		$(".money_100").attr("value","");
	});
	
	/*点击金额 50元时触发的事件*/
	$(".money_50").click(function(){
		$(this).css("border","1px solid #FF4040");
		$(".recharge").val("50");
		
		$(".money_10").css("border","1px solid #BBBBBB");
		$(".money_10").attr("value","");
		$(".money_1").css("border","1px solid #BBBBBB");
		$(".money_1").attr("value","");
		$(".money_100").css("border","1px solid #BBBBBB");
		$(".money_100").attr("value","");
	});
	
	/*点击金额 100元时触发的事件*/
	$(".money_100").click(function(){
		$(this).css("border","1px solid #FF4040");
		$(".recharge").val("100");
		
		$(".money_10").css("border","1px solid #BBBBBB");
		$(".money_10").attr("value","");
		$(".money_50").css("border","1px solid #BBBBBB");
		$(".money_50").attr("value","");
		$(".money_1").css("border","1px solid #BBBBBB");
		$(".money_1").attr("value","");
	});
	
	/*点击金额输入框时触发的事件*/
	$(".recharge").click(function(){
		$(".money_1").css("border","1px solid #BBBBBB");
		$(".money_10").css("border","1px solid #BBBBBB");
		$(".money_50").css("border","1px solid #BBBBBB");
		$(".money_100").css("border","1px solid #BBBBBB");
		
		var c=$(this);  
	    if(/[^\d]/.test(c.val())){//替换非数字字符  
	      var temp_amount=c.val().replace(/[^\d]/g,'');  
	      $(this).val(temp_amount);  
	    } 
		
	});
	
	
	/*点击充值 触发的事件*/
	$("#price").click(function(){
		var recharge=$(".recharge").val();
		var len1 = recharge.substr(0,1); 
		if(recharge =="" || len1==0 ){  
	        alert("请输入的值不能为空，并且不能以0开头");
	        return;	
	    }else{
			$(".recharge").val("");	
			$(".money_1").css("border","1px solid #BBBBBB");
			$(".money_10").css("border","1px solid #BBBBBB");
			$(".money_50").css("border","1px solid #BBBBBB");
			$(".money_100").css("border","1px solid #BBBBBB");
			
			rePrePay(recharge);
		}
		
	});
});

//***支付 *****///

/*orderno  :订单编号   price：金额*/

function rePrePay(price){
	   $.ajax({
			url: serverUrl + "/wxPay/get/pay",
			type: "post",
			dataType: "json",
			contentType : "application/json; charset=utf-8",
			data: '{"fee":"'+price+'","code":"'+ $.getUrlParam("code")+'"}',
			success: function(data) {
				if (data.code == 4 || data.code == 5){
					alert(data.msg);
				}else if(data.code == 3){
					alert("请用微信打开");
				}else if(data.code == 0){
					 onBridgeReady(data.data.jsParam, price);//再次支付
				} else{
					alert("系统错误");
				}
			}
		});
}

function onBridgeReady(jsParam, money){
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', 
	       jsParam,
	       function(res){
	           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                   	window.self.location ="payment_cg.html?user="+res.mch_id+"&money="+money+"&zhiFu_time"+res.time_end;
					return;
	           			           		
	            } else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
	                   //alert("用户取消支付!");  
					var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/payment.html&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
			           window.self.location = url;
	            }else{  
					var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=http://' + serverIp + '/h5/payment.html&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
			           window.self.location = url;
	                  //alert("支付失败!"); 
	            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
	       }
	   ); 
	}

 function payPay(){
	if (typeof WeixinJSBridge == "undefined"){
	   if( document.addEventListener ){
	       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	   }else if (document.attachEvent){
	       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	   }
	}else{
		onBridgeReady();
	} 
 }

