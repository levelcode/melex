var u_id,u_name,token;
var back_h = [];
var total_clients=0;
var page = 0;
var action = "";

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
	        		$("#menu").append("<li><a href='pages.html?tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
	        	}
	           	state = 0;
	           	loadContent();
	        }

	    },"json");
	}
}
function search_clients_by_name(){
	var term = $("#s_client").val();
	if( term.length>0){
		$("#loading").show();
		$("#wrapper").hide();
		$("#s_clientid").val("");

		

		$.post(urlA,{action:"search_clients_by_name",iduser:u_id,query:term},function(d){
			if(d.msg=="error"){
				alert("No hay resultados");
			}else{
				if(action==""){
					back_h.push({url:"main.html",query:term,action:"search_clients_by_name"});
					localStorage.setItem("back_h",JSON.stringify(back_h) );
					$("#back_bt").show();
				}
				$("#clients_table").html("");
				for(i=0;i<d.length;i++){
					c_id=d[i].cliente;
					c_name=d[i].nombre1+" "+d[i].nombre2;
					$("#clients_table").append("<a href='cliente.html?cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
				}			

				$(".next_clients").hide();		
				$(".prev_clients").hide();
				$(".page-data").text(	"0/0"	 );
			}
			$("#loading").hide();
			$("#wrapper").show();
		},"json");
	}
}
function search_clients_by_id(){
	var term = $("#s_clientid").val();
	if( term.length>0){
		$("#loading").show();
		$("#wrapper").hide();
		$("#s_client").val("");
		
		

		$.post(urlA,{action:"search_clients_by_id",iduser:u_id,query:term},function(d){
			if(d.msg=="error"){
				alert("No hay resultados");
			}else{
				if(action==""){
					back_h.push({url:"main.html",query:term,action:"search_clients_by_id"});
					localStorage.setItem("back_h",JSON.stringify(back_h) );
					$("#back_bt").show();
				}
				$("#clients_table").html("");
				for(i=0;i<d.length;i++){
					c_id=d[i].cliente;
					c_name=d[i].nombre1+" "+d[i].nombre2;
					$("#clients_table").append("<a href='cliente.html?cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
				}			

				$(".next_clients").hide();		
				$(".prev_clients").hide();
				$(".page-data").text(	"0/0"	 );
			}
			$("#loading").hide();
			$("#wrapper").show();
		},"json");
	}
}
function loadContent(){
	if(action!=""){
		if(action=="search_clients_by_name"){
			search_clients_by_name();
		}else if(action="search_clients_by_id"){
			search_clients_by_id();
		}
		$("#loading").hide();
	    	$("#wrapper").show();
	}else{
		$.post(urlA,{action:"get_total_clients",iduser:u_id},function(data){
			if(data.msg == "error"){
				alert("Error de conexión. "+data.detail);
			}else{
				total_clients = data.cantidad;

				$.post(urlA,{action:"get_brief_of_clients",iduser:u_id,page:page},function(d){
					if(d.msg == "error"){
						alert("Error de conexión."+data.detail);
					}else{
						//lista=$.parseJSON(d);
						for(i=0;i<d.length;i++){
							c_id=d[i].cliente;
							c_name=d[i].nombre1+" "+d[i].nombre2;
							$("#clients_table").append("<a href='cliente.html?cid="+c_id+"' class='list-group-item'>"+c_id+" - "+c_name+"</a>");
						}			
						if( (page+1)*50>total_clients){
							$(".next_clients").hide();		
						}
						if(page==0)
							$(".prev_clients").hide();
						var maxpages = Math.ceil(total_clients/50-1);
						if(maxpages>0){
							$(".page-data").text(	page+"/"+Math.ceil(total_clients/50-1)	 );
						}else{
							$(".pags").hide();
						}


						$("#loading").hide();
	    				$("#wrapper").show();

					}
				},"json");
			}
		},"json");
	}
}
function load_by_page(){
	sessionStorage.setItem("page",page);
	window.location.replace("main.html");
}


$(document).ready(function() {
	$("#wrapper").hide();
	//var params = urlObject({url:window.location.href });
	
	token = localStorage.getItem("t");
	u_id = localStorage.getItem("uid");
	u_name = localStorage.getItem("uname");

	if( !validateLS(token,u_id,u_name) ){
		window.location.replace("index.html");
	}else{
		
		if(sessionStorage.getItem("page")!= undefined)
			page = sessionStorage.getItem("page");
		state = 1;

		$("#headinguname").text(u_name);


		$("#back_bt").hide();
		if(	localStorage.getItem("back_h") != undefined){
			var dh=localStorage.getItem("back_h");
			back_h = JSON.parse(localStorage.getItem("back_h") );
			

			if(localStorage.getItem("back_tag") != undefined ){
				if(localStorage.getItem("back_tag") == "true" && back_h.length>0){
					localStorage.setItem("back_tag","false");
					if( back_h[back_h.length-1].query != undefined && back_h[back_h.length-1].action != undefined  ){
						
						action = back_h[back_h.length-1].action;
						if(action=="search_clients_by_name"){
							$("#s_client").val(back_h[back_h.length-1].query);
						}else if(action="search_clients_by_id"){
							$("#s_clientid").val(back_h[back_h.length-1].query);
						}
					}
					if(back_h[back_h.length-1].page != undefined )
						page= back_h[back_h.length-1].page;

					back_h.pop();
				}else{
					back_h.push({url:"main.html",page:page});
				}
			}else{
				localStorage.setItem("back_tag","false");
				back_h.push({url:"main.html"});
			}
			
			if(back_h.length < 2){
				$("#back_bt").hide();
			}else{
				$("#back_bt").show();
				console.log("showing bt");
			}
			localStorage.setItem("back_h",JSON.stringify(back_h) );
		}

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
		window.location.replace("cuenta.html");
	});
	$("#bt_clientes").click(function(){
		window.location.replace("main.html");
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
		action="";
		search_clients_by_name();
	});
	$("#bt_search_idclient").click(function(){
		action="";
		search_clients_by_id();
	});

	$("#bt_salir").click(function(){
		localStorage.setItem("t", "");
       	localStorage.setItem("uid", "");
        localStorage.setItem("uname", "");
	});
	$("#back_bt").click(function(){
		localStorage.setItem("back_tag","true");
		back_h.pop();
		localStorage.setItem("back_h",JSON.stringify(back_h) );
		window.location.replace(back_h[back_h.length-1].url);
	});
});


