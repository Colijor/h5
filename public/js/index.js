// item selection

$(function(){
	$("li").each(function(i){
				    $(this).click(function(){
				        alert("第" + i + "被选中"); //从零计数
				    });
				});
				/*$('li').click(function () {
			  $(this).toggleClass('selected');
				  /*if ($('li.selected').length > 1){
				  	$('.select').removeClass('selected');
				  }else{
				  	 $('.select').removeClass('selected');
				  counter();
				    
				  }
				});
				*/
				
				
				
		
});





// all item selection
/*$('.select').click(function () {
  if ($('li.selected').length <= 0) {
    $('li').addClass('selected');
    $('.select').addClass('selected');
  }
  else {
    $('li').removeClass('selected');
    $('.select').removeClass('selected');
  }
  counter();
});*/


/*$('li').click(function () {
	  $(this).toggleClass('selected');
		  if ($('li.selected').length > 1){
		  	$('.select').removeClass('selected');
		  }else{
		  	 $('.select').removeClass('selected');
		  counter();
		    
		  }
		});*/

// number of selected items
/*function counter() {
  if ($('li.selected').length < 1)
    $('.send').addClass('selected');
  else
    $('.send').removeClass('selected');
  $('.send').attr('data-counter',$('li.selected').length);
}
*/