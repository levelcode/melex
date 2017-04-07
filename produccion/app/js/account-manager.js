var u_id,token;
function valid(par){
	if(par.t == undefined || par.uid == undefined )
		return false;

	if(par.t == "" || par.uid == "" )
		return false;

	return true;
}
function loadMenu(){

	$.post( urlA,{action:"get_available_tables"}, function( data ) {
        if(data.msg == "error"){
            alert("Error de conexión.");
        }else{
        	for(i=0 ; i< data.length ; i++){
        		m_tid=data[i].id;
        		m_tn=data[i].name;
        		m_tp=data[i].publico;
        		$("#menu").append("<li><a href='pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
        	}
        	state = 0;
        	$("#wrapper").show();
        }

    },"json");
}
function loadContent(){
	$.post( urlA,{action:"get_available_tables"}, function( data ) {
        if(data.msg == "error"){
            alert("Error de conexión.");
        }else{
        	for(i=0 ; i< data.length ; i++){
        		m_tid=data[i].id;
        		m_tn=data[i].name;
        		m_tp=data[i].publico;
        		$("#menu").append("<li><a href='pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
        	}
        	state = 0;
        	$("#wrapper").show();
        }

    },"json");
}
$(document).ready(function() {

	$("#wrapper").hide();
	var params = urlObject({url:window.location.href });
	token = localStorage.getItem("t");
	u_id = localStorage.getItem("uid");
	u_name = localStorage.getItem("uname");

	if( !validateLS(token,u_id,u_name) ){
		window.location.replace("index.html");
	}else{
		
		state =1;
		state = 0;

		$("#headinguname").text(u_name);
	    //loadContent();
		$("#wrapper").show();
	}

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
                    	localStorage.setItem("t", data.token);
                        localStorage.setItem("uid", data.userid);
                        window.location.replace("main.html");
                    }else{
                        setState(0,data.detail);
                        $("#bt_continue").removeClass("in_process");
                    }
                },"json");
			}
		}
	});

	$("#bt_clientes").click(function(){
		sessionStorage.setItem("page",0);
		window.location.replace("main.html");
	});

	$("#bt_salir").click(function(){
		localStorage.setItem("t", "");
       	localStorage.setItem("uid", "");
        localStorage.setItem("uname", "");
	});
});