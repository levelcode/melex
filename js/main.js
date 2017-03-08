var u_id,u_name,token;
var total_clients=0;
var page = 0;
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
	$.post(urlA,{action:"get_total_clients",iduser:u_id},function(data){
		if(data.msg == "error"){
			alert("Error de conexión.");
		}else{
			total_clients = $.parseJSON(data).cantidad;
			$.post(urlA,{action:"get_brief_of_clients",iduser:u_id,page:page},function(d){
				if(d.msg == "error"){
					alert("Error de conexión.");
				}else{
					lista=$.parseJSON(d);
					for(i=0;i<lista.length;i++){
						c_id=lista[i].cliente;
						c_name=lista[i].nombre1+" "+lista[i].nombre2;
						$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'><span class='glyphicon glyphicon-chevron-right'></span> "+c_name+"</a>");
					}			
					if( (page+1)*50>total_clients){
						$(".next_clients").hide();		
					}
					if(page==0)
						$(".prev_clients").hide();
					$(".page-data").text(	page+"/"+Math.ceil(total_clients/50-1)	 );
					$("#loading").hide();
    				$("#wrapper").show();
				}
				
			});
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
		if(params.parameters.page!= undefined)
			page = params.parameters.page;
		state = 1;

		$("#headingname").text(u_name);
		loadMenu();
	}

	$(".next_clients").click(function(){
		page++;
		load_by_page();
	});

	$(".prev_clients").click(function(){
		page--;
		load_by_page();
	});

	$("#bt_cuenta").click(function(){
		window.location.replace("cuenta.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});
	$("#bt_clientes").click(function(){
		window.location.replace("main.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});

});