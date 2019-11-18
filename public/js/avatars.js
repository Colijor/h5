// item selection
var i=0;

$(function(){
	$("li").each(function(i){
	    $(this).click(function(){
	        //alert("第" + i + "被选中"); //从零计数
	        $("li").removeClass('selected');
	        $(this).removeClass('selected').addClass('selected');
	        	        
	        var head=i+1;
	        	        
	        $.ajax({
				url: serverUrl + "/members/update/head",
				type: "post",
				dataType: "json",
				contentType : "application/json; charset=utf-8",
				data: '{"head":"'+head+'"}',
				success: function(data) {
					if (data.code == 0){
						alert(data.msg);
						//window.location.href = "/h5/personal_Center.html";						
					}else{
						alert(data.msg);
					}
				}
			});
			
			
	    });
	});	
	
	//$("#avatars_fh").click(function(){
	//	$("#avatars_fh").attr("target", "_blank"); 

	//	 $("#avatars_fh").attr("href","/h5/personal_Center.html");	
	//});
	
	
});


