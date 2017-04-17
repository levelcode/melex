var u_id,u_name,token,c_id,c_name;

var tid=0;
var page=0;
var total=0;
var dates=[];

var filtered=0;
var ffrom=0;
var fto=0;

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
            alert("Error de conexión: 1.");
        }else{
        	 for(i=0 ; i< data.length ; i++){
        		m_tid=data[i].id;
        		m_tn=data[i].name;
        		m_tp=data[i].publico;

        		m_ti=data[i].icono;
        		if(m_tid == tid){
        			$("#table_name").text(m_tp);
        		}

        		//$("#menu").append("<li><a href='pages.html?tid="+m_tid+"'> "+m_tp+"</a></li>");
        		if(m_ti == "NULL" || m_ti == "null" || m_ti == null)
        			m_ti="icon_network.png";
        		var page_link="<li><a href='pages.html?tid="+m_tid+"'><img class='t_icon' src='http://melexa.info/app_melexa/img/icons/"+m_ti+"'> "+m_tp+"</a></li>";

        		$("#menu").append(page_link);

        	}
           	loadTimeHeaders();
        }

    },"json");
}
function loadTimeHeaders(){
	$.post( urlA,{action:"get_table_fields_datetime",tid:tid}, function( data ) {
        if(data.msg == "error"){
            alert("Error de conexión: 2.");
        }else{
        	for(i=0 ; i< data.length ; i++){
        		dates.push(data[i]);
        	}
           	loadContent();
        }

    },"json");
}
function loadContent(){
	if(filtered==0)
		$.post(urlA,{action:"get_total_data_in_table",tid:tid,idclient:c_id},function(data){
			var i_resp=$.parseJSON(data);
			if(i_resp.msg == "error"){
				alert("Error de conexión: 3. "+i_resp.detail);
			}else{
				total = $.parseJSON(data).cantidad;

				$.post(urlA,{action:"get_table_details",tid:tid,idclient:c_id,page:page},function(d){
					var j_resp=$.parseJSON(d);
					if(j_resp.msg == "error"){
						alert("Error de conexión: 4.");
					}else{
						lista=j_resp;
						state=0;
						for(i=0;i<lista.length;i++){
							var row="<tr>";
							lista[i].forEach(function(item){
								if(i==0){
									row+="<th>"+item+"</th>";
									var a = dates.indexOf(item);
									if(a>=0){
										$(".filtros").show();
										console.log(item);
										$("#filter").append("<option value='"+item+"'>"+item+"</option>");
									}
								}
								else
									row+="<td>"+item+"</td>";
							});
							row+="</tr>";
							$("#tbody").append(row);
						}			
						if(total==0){
							$(".pags").hide();

						}else{
							$(".pags").show();
							page = parseInt(page);
							if( (page+1)*50>total){
								$(".next_page").hide();		
							}
							if(page==0)
								$(".prev_page").hide();
							$(".page-data span").text(	page+"/"+Math.ceil(total/50-1)	 );
						}

						

						$("#loading").hide();
	    				$("#wrapper").show();

	    				$("#page-wrapper").css("min-width",($("#fields_table table").width()+25)+"px" );
					}
					
				});
			}
		});
	else{
		$("#filter").val(filtered);
		$("#dpick1 input").val(ffrom);
		$("#dpick2 input").val(fto);
		$.post(urlA,{action:"get_total_data_in_table",tid:tid,idclient:c_id,filter:filtered,min:ffrom,max:fto},function(data){
			var k_resp=$.parseJSON(data);
			if(k_resp.msg == "error"){
				alert("Error de conexión: "+k_resp.detail);
			}else{
				$("#loading").hide();
	    		$("#wrapper").show();
				total = $.parseJSON(data).cantidad;
				$.post(urlA,{action:"get_table_details",tid:tid,idclient:c_id,page:page,filter:filtered,min:ffrom,max:fto},function(d){
					var j_resp=$.parseJSON(d);
					if(j_resp.msg == "error"){
						alert("Error de conexión: "+j_resp.detail);

					}else{
						lista=$.parseJSON(d);
						state=0;
						for(i=0;i<lista.length;i++){
							var row="<tr>";
							lista[i].forEach(function(item){
								if(i==0){
									row+="<th>"+item+"</th>";
									var a = dates.indexOf(item);
									if(a>=0){
										$(".filtros").show();
										console.log(item);
										$("#filter").append("<option value='"+item+"'>"+item+"</option>");
									}
								}
								else
									row+="<td>"+item+"</td>";
							});
							row+="</tr>";
							$("#tbody").append(row);
						}			
						if(total == 0){
							$(".pags").hide();
						}else{
							$(".pags").show();
							if( (page+1)*50>total){
								$(".next_page").hide();		
							}
							if(page==0)
								$(".prev_page").hide();
							$(".page-data span").text(	page+"/"+Math.ceil(total/50-1)	 );
							$("#loading").hide();
		    				$("#wrapper").show();
	    				}
					}
					
				});
			}
		});
	}
}
function load_by_page(){
	localStorage.setItem("page",page);
	window.location.replace("pages.html");
}
function filter(){
	f_name=$("#filter").val();
	f_from=$("#dpick1 input").val();
	f_till=$("#dpick2 input").val();
	if(f_from == "" || f_till == ""){
		alert("Debe ingresar fecha inicial y fecha final.");
	}else{
		//localStorage.setItem("last_filter","pages.html");
		window.location.replace("pages.html?filter="+f_name+"&from="+f_from+"&to="+f_till);
	}
	
}


$(document).ready(function() {
	$("#wrapper").hide();

	token = localStorage.getItem("t");
	u_id = localStorage.getItem("uid");
	u_name = localStorage.getItem("uname");

	c_id = localStorage.getItem("cid");
	c_name = localStorage.getItem("cname");


	var params = urlObject({url:window.location.href });
	if(params.parameters.tid != undefined){
		tid = params.parameters.tid;
		localStorage.setItem("tid",tid);
		localStorage.setItem("page",0);
	}else{
		if(localStorage.getItem("tid") != undefined )
			tid = localStorage.getItem("tid");
	}

	if( !validateLS(token,u_id,u_name) || !validateLS(c_id,c_name,tid) ){
		window.location.replace("index.html");
	}else{
		
		if(localStorage.getItem("page")!= undefined){
			page = localStorage.getItem("page");
		}


		$("#back_bt").hide();
		if(localStorage.getItem("back_h") != undefined  ){
			var dh=localStorage.getItem("back_h");
			back_h = JSON.parse(localStorage.getItem("back_h") );
			if(localStorage.getItem("back_tag") != undefined) {
				if(localStorage.getItem("back_tag") == "true" && back_h.length>0){
					localStorage.setItem("back_tag","false");
					if( back_h[back_h.length-1].cid != undefined)
						c_id=back_h[back_h.length-1].cid;

					if( back_h[back_h.length-1].tid != undefined)
						tid=back_h[back_h.length-1].tid;

					if( back_h[back_h.length-1].page != undefined)
						page=back_h[back_h.length-1].page;
					
					//back_h.pop();
				}else{
					back_h.push({url:window.location.href,page:page,cid:c_id,tid:tid});
				}
			}else{
				back_h.push({url:window.location.href,page:page,cid:c_id,tid:tid});
			}
			if(back_h.length < 2){
				$("#back_bt").hide();
			}else{
				$("#back_bt").show();
				console.log("showing bt");
			}
			console.log(back_h);
			localStorage.setItem("back_h",JSON.stringify(back_h) );
		}


		/*last_post="";
		if(	localStorage.getItem("last_post") == undefined){
			$(".navbar-back").hide();
		}else{
			last_post=localStorage.getItem("last_post");
			last_page=localStorage.getItem("last_page");
		}
		localStorage.setItem("last_post",window.location.href);
		*/


		if(params.parameters.filter!= undefined && params.parameters.from!= undefined && params.parameters.to!= undefined){
			filtered 	= params.parameters.filter;
			ffrom 		= params.parameters.from;
			fto 		= params.parameters.to;
		}


		state =1;

		$("#headinguname").text(u_name);
		$("#headingcname").text(c_name);

		loadMenu();
		





		$(".next_page").click(function(){
			page++;
			load_by_page();
		});

		$(".prev_page").click(function(){
			page--;
			load_by_page();
		});	

		$('.datetimepicker').datetimepicker({
		    format: 'YYYY-MM-DD'
		});

		$("#bt_filter").click(function(){
			filter();
		});

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
		$("#back_bt").click(function(){
			localStorage.setItem("back_tag","true");
			back_h.pop();
			localStorage.setItem("back_h",JSON.stringify(back_h) );
			window.location.replace(back_h[back_h.length-1].url);
		});

		$("#headingcname").click(function(){
			window.location.replace("cliente.html");
		});
	}
});