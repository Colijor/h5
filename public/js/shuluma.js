$(function(){
		
	$("#go").click(function() {
		var shuluma_text=$("#shuluma_text").val();
				
		if(shuluma_text == null || shuluma_text == ""){
			alert("屏幕码不能为空");
			return;
		}else if(shuluma_text.length < 6){
			alert("屏幕码不能少于6位数");
			return;
		}
						
		$.get(serverUrl + "/gameBox/get/code?specialCode=" + shuluma_text, function(data) {
			if (data.code == 0) {
				window.location.href = serverUrl + "/h5/game_cj.html?gameUrl="+serverUrl+"/h5/game_cj.html&boxNumber=" + data.data;
			}else{
				alert(data.msg);
				return;
			}
		});
	});
	
});