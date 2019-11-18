$(function(){
	$.get(serverUrl + "/activityPrize/get/activityPrizeById?id="+$.getUrlParam('id'), function(data) {
		if(data.code == 0){
			var startTime=timeFormat(data.data.createTime);//活动开始时间
			var endTime=timeFormat(data.data.expiryTime);//活动结束时间
			$(".rece_center p:nth-child(1) span").text(data.data.goodName);//奖品名称
			if(data.data.content && data.data.content != "null" && data.data.content != null){
				$(".rece_center p:nth-child(2) span").text(data.data.content);//兑换门店
			}
			$(".rece_center p:nth-child(3) span").text("结账时请点击\"立即使用\"");//活动时间
			$(".rece_center p:nth-child(5) span").text(startTime + "-"+endTime);//截止日期
			$("#explain").html(data.data.explain);
			
			if(data.data.state != 0){
				//已领取
				$("#rece_button").css({"background-color":"#F2F2F2","color":"#000000","border":"1px solid red"});
				$("#rece_button").text("已领取");
				$("#rece_button").unbind();		
			}else{
				var td=Date.parse(new Date()); 
				if(endTime < td){
					$("#rece_button").css({"background-color":"#F2F2F2","color":"#000000","border":"1px solid red"});
					$("#rece_button").text("已过期");
					$("#rece_button").unbind();		
				}else{
					$("#rece_button").click(function(){
						if(confirm('确认使用？')){
							$.ajax({
								url: serverUrl + "/activityPrize/update/status",
								type: "post",
								dataType: "json",
								contentType : "application/json; charset=utf-8",
								data: '{"activityPrizeId":"'+data.data.id+'"}',
								success: function(data) {
									if (data.code == 0){
										//alert("领取成功");
										//点击“立即领取后” 按钮变色
										$("#rece_button").css({"background-color":"#F2F2F2","color":"#000000","border":"1px solid red"});
										$("#rece_button").text("已领取");
										location.reload();
									}else{
										alert(data.msg);
									}
								}
							});	
						  }else{
						  	return false;
						 }																								
					});
				}
			}
			
		}							
	});	
			
});
	
	
	

function timeFormat(nS) {     
	return new Date(parseInt(("/Date("+nS+")/").substr(6, 13))).toLocaleDateString();     
} 

function getQueryString(key){
	var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result?decodeURIComponent(result[2]):null;
}

function getMyDate(strs){  
        var oDate = new Date(strs),  
        oYear = oDate.getFullYear(),  
        oMonth = oDate.getMonth()+1,  
        oDay = oDate.getDate(),  
        oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay);//最后拼接时间  
        return oTime;  
    };  
//补0操作  
function getzf(num){  
	if(parseInt(num) < 10){  
		num = '0'+num;  
	}  
	return num;  
}  
