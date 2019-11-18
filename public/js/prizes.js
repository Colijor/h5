
$(function(){
	$.get(serverUrl + "/activityPrize/get/activityPrizeByMemberId", function(data) {
		if(data.code == 0){
			$.each(data.data, function(i, item) {
				var str="";
				var td=Date.parse(new Date());
				
				if(item.state == 0){
					if(item.expiryTime < td){
						str="已过期";
						$(".prizes_contanir").prepend(
						"<a href=/h5/receive_prize.html?id="+item.id+"&goodName="+item.goodName+"&storeName="+item.storeName+"&expiryTime="+item.expiryTime+"&startTime="+item.startTime+"&endTime="+item.endTime+"&state="+item.state+">"+
						"<div><p>"+item.goodName+"</p>"+
						"<p>中奖时间：<span>"+getMyDate(item.createTime)+"</span></p>"+
						"<p><span><font color=#CF2D28>"+str+"</font></span></p>"+
						"</div></a>");
					}else{
						if(item.address && item.address != null && item.address != "null"){
							str="待领取";																
							$(".prizes_contanir").prepend(
							"<a href='"+item.address+"'><div><p>"+item.goodName+"</p>"+
							"<p>中奖时间：<span>"+getMyDate(item.createTime)+"</span></p>"+
							"<p><span><font color=#CF2D28>"+str+"</font></span></p>"+
							"</div></a>");
						}else{
							str="待领取";																
							$(".prizes_contanir").prepend(
							"<a href=/h5/receive_prize.html?id="+item.id+"&goodName="+item.goodName+"&storeName="+item.storeName+"&expiryTime="+item.expiryTime+"&startTime="+item.startTime+"&endTime="+item.endTime+"&state="+item.state+">"+
							"<div><p>"+item.goodName+"</p>"+
							"<p>中奖时间：<span>"+getMyDate(item.createTime)+"</span></p>"+
							"<p><span><font color=#CF2D28>"+str+"</font></span></p>"+
							"</div></a>");
						}
					}																															 
				}else{
					str="已领取";					
					$(".prizes_contanir").prepend(
	            	"<div><p>"+item.goodName+"</p>"+
					"<p>中奖时间：<span>"+getMyDate(item.createTime)+"</span></p>"+
	            	"<p><a href=/h5/receive_prize.html?id="+item.id+"&goodName="+item.goodName+"&expiryTime="+item.expiryTime+"&startTime="+item.startTime+"&endTime="+item.endTime+"&state="+item.state+"><span><font color=#2AC845>"+str+"</font></span></a></p>"+
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
        oHour = oDate.getHours();
        oMinute = oDate.getMinutes();
        oSecond = oDate.getSeconds();
        oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay) +" "+getzf(oHour) +":"+getzf(oMinute) +":"+getzf(oSecond);//最后拼接时间  
        return oTime;  
    };  
//补0操作  
function getzf(num){  
	if(parseInt(num) < 10){  
		num = '0'+num;  
	}  
	return num;  
}  
