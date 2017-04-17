$(document).ready(function() {
	$("#wrapper").hide();
	var params = urlObject({url:window.location.href });
	console.log(params);
	if( !valid(params.parameters) ){
		window.location.replace("index.html");
	}else{
		u_id=params.parameters.uid;
		u_name=params.parameters.uname;
		token = params.parameters.t;
		
		$("#loading").hide();
    	$("#wrapper").show();
		
	}
});