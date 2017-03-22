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
	if(idclient == 0){
		state = 0;
	    loadContent();
	}else{
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
						//$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'><span class='glyphicon glyphicon-chevron-right'></span> "+c_name+"</a>");
						$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
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

		$("#headinguname").text(u_name);
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
		window.location.replace("pass.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});
	$("#bt_clientes").click(function(){
		window.location.replace("main.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
	});


	//autocomplete
	$("#s_client").autocomplete({
		source: function(request,response){
			$.post(urlA,{action:"autocomplete_clients",iduser:u_id,query:request.term},function(d){
				response(d);
			},"json");
		},minLength:3
	});

	$("#bt_search").click(function(){
		var term = $("#s_client").val();
		if( term.length>0){
			$("#loading").show();
    		$("#wrapper").hide();
    		$("#s_clientid").val("");
			$.post(urlA,{action:"search_clients_by_name",iduser:u_id,query:term},function(d){
				if(d.msg=="error"){
					alert("No hay resultados");
				}else{
					$("#clients_table").html("");
					for(i=0;i<d.length;i++){
						c_id=d[i].cliente;
						c_name=d[i].nombre1+" "+d[i].nombre2;
						//$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'><span class='glyphicon glyphicon-chevron-right'></span> "+c_name+"</a>");
						$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
					}			

					$(".next_clients").hide();		
					$(".prev_clients").hide();
					$(".page-data").text(	"0/0"	 );
				}
				$("#loading").hide();
    			$("#wrapper").show();
			},"json");
		}
	});


	$("#bt_search_idclient").click(function(){
		var term = $("#s_clientid").val();
		if( term.length>0){
			$("#loading").show();
    		$("#wrapper").hide();
    		$("#s_client").val("");
			$.post(urlA,{action:"search_clients_by_id",iduser:u_id,query:term},function(d){
				if(d.msg=="error"){
					alert("No hay resultados");
				}else{
					$("#clients_table").html("");
					for(i=0;i<d.length;i++){
						c_id=d[i].cliente;
						c_name=d[i].nombre1+" "+d[i].nombre2;
						//$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'><span class='glyphicon glyphicon-chevron-right'></span> "+c_name+"</a>");
						$("#clients_table").append("<a href='cliente.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
					}			

					$(".next_clients").hide();		
					$(".prev_clients").hide();
					$(".page-data").text(	"0/0"	 );
				}
				$("#loading").hide();
    			$("#wrapper").show();
			},"json");
		}
	});



});