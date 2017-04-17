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

function loadContent(){
	
	loadMenu();	
}


$(document).ready(function() {
	$("#wrapper").hide();

	token = localStorage.getItem("t");
	u_id = localStorage.getItem("uid");
	u_name = localStorage.getItem("uname");


	var params = urlObject({url:window.location.href });

	if( !validateLS(token,u_id,u_name)	){
		window.location.replace("index.html");
	}else{
		
		
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
					back_h.push({url:"pricing.html"});
				}
			}else{
				localStorage.setItem("back_tag","false");
				back_h.push({url:"pricing.html"});
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

	$("#bt_pricing").click(function(){
		localStorage.setItem("page",0);
		window.location.replace("pricing.html");
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

	$("#row_family").hide();
	$(".titem").change(function(){
		$("#row_family").hide();
		$("#row_product").hide();
		if($(this).val()=="Producto"){
			$("#row_product").show();
		}else{
			$("#row_family").show();
		}
	});
});