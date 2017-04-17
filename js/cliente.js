var u_id,u_name,token,c_name;
var c_id=undefined;
var back_h = [];
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
        		m_ti=data[i].icono;
        		if(m_ti == "NULL" || m_ti == "null" || m_ti == null)
        			m_ti="icon_network.png";
        		var page_link="<li><a href='pages.html?tid="+m_tid+"'><img class='t_icon' src='http://melexa.info/app_melexa/img/icons/"+m_ti+"'> "+m_tp+"</a></li>";

        		$("#menu").append(page_link);
        		$("#tablas_links").append(page_link);
        	}
           	state = 0;
           	$("#loading").hide();
			$("#wrapper").show();
        }

    },"json");
}
function loadExpert(){
	$.post(urlA,{action:"get_expert",cid:c_id},function(d){
		var resp=$.parseJSON(d);
		if(resp.msg == "error"){
				alert("Error de conexión: 1. "+i_resp.detail);
		}else{
			state=0;
			for(i=0;i<resp.length;i++){
				var row="<tr>";
				resp[i].forEach(function(item){
					if(i==0)
						row+="<th>"+item+"</th>";
					else
						row+="<td>"+item+"</td>";
				});
				row+="</tr>";
				$("#tbody").append(row);
			}
		}
	});
	loadMenu();
}
function loadContent(){
	$.post(urlA,{action:"get_clients_by_params",cid:c_id},function(d){
		if(d.msg == "error"){
			alert("Error de conexión.");
		}else{
			lista=$.parseJSON(d);

			for(i=0;i<lista.length;i++){
				c_id=lista[i].cliente;
				c_name=c_id+" - "+lista[i].nombre1+" "+lista[i].nombre2;
				localStorage.setItem("cname",c_name);
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
			
		}
		loadExpert();		
	});
}


$(document).ready(function() {
	$("#wrapper").hide();

	token = localStorage.getItem("t");
	u_id = localStorage.getItem("uid");
	u_name = localStorage.getItem("uname");


	var params = urlObject({url:window.location.href });
	if(params.parameters.cid != undefined){
		c_id = params.parameters.cid;
		localStorage.setItem("cid",c_id);
	}else{
		if(localStorage.getItem("cid") != undefined )
		c_id = localStorage.getItem("cid");
	}
	//console.log(params);
	if( !validateLS(token,u_id,u_name) || c_id == undefined ){
		window.location.replace("index.html");
	}else{
		
		if(localStorage.getItem("page")!= undefined)
			page = localStorage.getItem("page");


		$("#back_bt").hide();
		if(	localStorage.getItem("back_h") != undefined){
			var dh=localStorage.getItem("back_h");
			back_h = JSON.parse(localStorage.getItem("back_h") );

			if(localStorage.getItem("back_tag") != undefined ){
				if(localStorage.getItem("back_tag") == "true" && back_h.length>0){
					localStorage.setItem("back_tag","false");
					if(back_h[back_h.length-1].cid != undefined)
						c_id = back_h[back_h.length-1].cid;
					back_h.pop();
				}else{
					back_h.push({url:"cliente.html",cid:c_id});
				}
			}else{
				localStorage.setItem("back_tag","false");
				back_h.push({url:"cliente.html",cid:c_id});
			}
			
			if(back_h.length < 2){
				$("#back_bt").hide();
			}else{
				$("#back_bt").show();
				console.log("showing bt");
			}
			localStorage.setItem("back_h",JSON.stringify(back_h) );
		}





		state = 1;

		$("#headinguname").text(u_name);

		loadContent()
	}
	$("#bt_cuenta").click(function(){
		window.location.replace("cuenta.html");
	});
	$("#bt_clientes").click(function(){
		localStorage.setItem("page",0);
		window.location.replace("main.html");
	});

	$("#bt_salir").click(function(){
		localStorage.setItem("t", "");
       	localStorage.setItem("uid", "");
        localStorage.setItem("uname", "");
	});
	$(".navbar-back").click(function(){
		localStorage.setItem("back_tag","true");
		back_h.pop();
		localStorage.setItem("back_h",JSON.stringify(back_h) );
		window.location.replace(back_h[back_h.length-1].url);
	});
});