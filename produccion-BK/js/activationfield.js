$(document).ready(function() {

    $(".icheck").change(function() {
    	var tid = $(this).attr("rot");
    	var fname = $(this).attr("rel");
        var active=0;
    	if($(this).is(":checked")) {
            active=1;
        }
        $.post( "api/api.php",{action:"fieldActivation",id_table:tid,fname:fname,active:active});
    });
    

    $(".p_field").change(function(){
    	var tid 	= $(this).attr("rot");
    	var fname 	= $(this).attr("rel");
    	var str 	= $(this).val();
    	if(str != "" ){
    		$.post("api/api.php", {action:"fieldPublic",id_table:tid,fname:fname,fpublic:str} );
    	}
    });
});