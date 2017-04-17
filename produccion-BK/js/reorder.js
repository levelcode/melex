var processing = false;

function evaluateArrows(){
	//$("#tabla1").
	$(".flecha").show();
	$("#tabla1  tr").eq(1).find(".f_up").hide();
	$("#tabla1  tr:last-child .f_down").hide();
}

function setNewOrder(idtable, idorder){
	processing = true;

	$.post( "api/api.php",{action:"swapOrder",id_table:idtable,order:idorder}, function( data ) {
  		
  		if(data.msg = "ok"){
	  		var idother = data.otherAfected;
	  		var orderother = data.orderAfected;
	  		if(idother>0){
	  			if(orderother>idorder){
			  		//down
			  		$("#tb_"+idtable).after($("#tb_"+idother));
			  		//jQuery("#tb_"+idtable).next().after(jQuery("#tb_"+idother));
				}else{
			  		//up
			  		$("#tb_"+idtable).before($("#tb_"+idother));
					//jQuery("#tb_"+idtable).prev().before(jQuery("#tb_"+idother));
				}
				$("#tb_"+idother+" .flecha").attr("ror",orderother);
				$("#tb_"+idother+" .tdorder").text(orderother);
			}
			$("#tb_"+idtable+" .flecha").attr("ror",idorder);
			$("#tb_"+idtable+" .tdorder").text(idorder);
			//TODO set new order values 

  		}else{
  			alert(data.msg);
  		}
  		processing = false;
  		evaluateArrows();
	}, "json");
}



$(document).ready(function() {
    
    evaluateArrows();
    $(".f_up").click(function(){
    	if( processing == true)
    		return;

    	var or = $(this).attr("ror");
    	var it = $(this).attr("rel");
    	if(or >0){
    		or--;
    		setNewOrder(it,or);
    	}
    });
    $(".f_down").click(function(){
    	if( processing == true)
    		return;

    	var or = $(this).attr("ror");
    	var it = $(this).attr("rel");
    	or++;
    	setNewOrder(it,or);
    });
});