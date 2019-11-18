$(function(){
			
	$.get(serverUrl + "/orders/get/ordersByMemberId", function(data) {							
		if(data.code == 0){	
			$.each(data.data, function(i, item) {
				var str="";	
				if(item.state == 1){
					str="已确认";	
					$(".recharge_contanir").prepend(
	            	"<div>"+
					"<p>"+getMyDate(item.updateTime)+"</p>"+
					"<p>充值金额：<span>"+item.discount+"</span>¥<span>"+str+"</span></p>"+
					"<p>获得红币：<span>"+item.discount*100+"个</span></p>"+
					"</div>");	
				}else if(item.state == 2){
					str="未支付";
					$(".recharge_contanir").prepend(
	            	"<div>"+
					"<p>"+getMyDate(item.updateTime)+"</p>"+
					"<p>充值金额：<span>"+item.discount+"</span>¥<span style='color:#FF0000;'>"+str+"</span></p>"+
					"<p>获得红币：<span>"+item.discount*100+"个</span></p>"+
					"</div>");	
				}else if(item.state == 3){
					str="已支付";
					$(".recharge_contanir").prepend(
	            	"<div>"+
					"<p>"+getMyDate(item.updateTime)+"</p>"+
					"<p>充值金额：<span>"+item.discount+"</span>¥<span>"+str+"</span></p>"+
					"<p>获得红币：<span>"+item.discount*100+"个</span></p>"+
					"</div>");	
				}
	            			
	        });																			
		}				
	});				
});

function getMyDate(strs){  
	var oDate = new Date(strs),  
        oYear = oDate.getFullYear(),  
        oMonth = oDate.getMonth()+1,  
        oDay = oDate.getDate(),  
        oHour = oDate.getHours(),  
        oMin = oDate.getMinutes(),  
        oSen = oDate.getSeconds(),  
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间  
        return oTime;  
};  
//补0操作  
function getzf(num){  
	if(parseInt(num) < 10){  
		num = '0'+num;  
	}  
		return num;  
}  