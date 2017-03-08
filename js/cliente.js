var u_id,u_name,token;
var id_client=0;
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
           	loadContent();
        }

    },"json");

}
//clients_table
//<a href='#' class='list-group-item'><span class='glyphicon glyphicon-chevron-right'></span> Cliente 1</a>
function loadContent(){
	
	$.post(urlA,{action:"get_clients_by_params",cid:id_client},function(d){
		if(d.msg == "error"){
			alert("Error de conexión.");
		}else{
			lista=$.parseJSON(d);
			for(i=0;i<lista.length;i++){
				c_id=lista[i].cliente;
				c_name=lista[i].nombre1+" "+lista[i].nombre2;
				c_direccion1 =  lista[i].direccion1;
				c_direccion2 =  lista[i].direccion2;
				c_ciudad	 = 	lista[i].ciudad;
				c_telefono1 	 = 	lista[i].telefono1;
				c_telefono2 	 = 	lista[i].telefono2;
				c_nit 		= lista[i].nit;
				$("#cnombre").val(c_name);
				$("#cnit").val(c_nit);
				$("#cdireccion1").val(c_direccion1);
				$("#cdireccion2").val(c_direccion2);
				$("#cciudad").val(c_ciudad);
				$("#ctelefono1").val(c_telefono1);
				$("#ctelefono2").val(c_telefono2);
			}	
			$("#loading").hide();
			$("#wrapper").show();
		}
		
	});
}
function load_by_page(){
	window.location.replace("main.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page="+page);
}


$(document).ready(function() {
	$("#wrapper").hide();
	var params = urlObject({url:window.location.href });
	//console.log(params);
	if( !valid(params.parameters) ){
		window.location.replace("index.html");
	}else{
		u_id=params.parameters.uid;
		u_name=params.parameters.uname;
		token = params.parameters.t;
		id_client = params.parameters.cid;
		if(params.parameters.page!= undefined)
			page = params.parameters.page;
		state = 1;

		$("#headingname").text(u_name);
		loadMenu();
	}
	$("#bt_cuenta").click(function(){
		window.location.replace("cuenta.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});
	$("#bt_clientes").click(function(){
		window.location.replace("main.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});
});