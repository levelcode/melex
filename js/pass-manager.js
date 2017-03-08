$(document).ready(function() {
	$("#bt_continue").click(function(){
		if(state == 0){
			n_p=$("#new_pass").val();
			c_p=$("#confirm_pass").val();
			if(n_p==""||c_p==""){
				$("#msg_info").text("No pueden haber campos vacios.");
			}
			else if(n_p != c_p ){
				$("#msg_info").text("La clave de confirmación, nó coincide.");
			}else{
				setState(1,"Procesando");
				$(this).addClass("in_process");
				$.post( urlA,{action:"set_pass_by_user",uid:u_id,pass:n_p}, function( data ) {
                    if(data.msg == "ok"){
                        window.location.replace("main.html?t="+data.token+"&uid="+data.userid);
                    }else{
                        setState(0,data.detail);
                        $("#bt_continue").removeClass("in_process");
                    }
                },"json");
			}
		}
	});
});