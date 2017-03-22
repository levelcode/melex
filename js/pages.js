var u_id,u_name,token,c_id,c_name;

var tid=0;
var page=0;
var total=0;
var dates=[];

var filtered=0;
var ffrom=0;
var fto=0;
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
        		if(m_tid == tid){
        			$(".page-header h1").text(m_tp);
        		}
        		//$("#menu").append("<li><a href='pages.html?t="+token+"&cid="+c_id+"&uname="+u_name+"&tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
        		$("#menu").append("<li><a href='pages.html?t="+token+"&uid="+u_id+"&cid="+c_id+"&cname="+c_name+"&uname="+u_name+"&tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
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
			if(data.msg == "error"){
				alert("Error de conexión: 3.");
			}else{
				total = $.parseJSON(data).cantidad;
				$.post(urlA,{action:"get_table_details",tid:tid,idclient:c_id,page:page},function(d){
					if(d.msg == "error"){
						alert("Error de conexión: 4.");
					}else{
						lista=$.parseJSON(d);
						state=0;
						for(i=0;i<lista.length;i++){
							/*c_id=lista[i].cliente;
							c_name=lista[i].nombre1+" "+lista[i].nombre2;
							*/
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
						if( (page+1)*50>total){
							$(".next_page").hide();		
						}
						if(page==0)
							$(".prev_page").hide();
						$(".page-data span").text(	page+"/"+Math.ceil(total/50-1)	 );
						

						

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
		$.post(urlA,{action:"get_total_data_in_table",tid:tid,iduser:u_id,filter:filtered,min:ffrom,max:fto},function(data){
			if(data.msg == "error"){
				alert("Error de conexión: 5.");
			}else{
				$("#loading").hide();
	    		$("#wrapper").show();
				total = $.parseJSON(data).cantidad;
				$.post(urlA,{action:"get_table_details",tid:tid,iduser:u_id,page:page,filter:filtered,min:ffrom,max:fto},function(d){
					if(d.msg == "error"){
						alert("Error de conexión: 6.");

					}else{
						lista=$.parseJSON(d);
						state=0;
						for(i=0;i<lista.length;i++){
							/*c_id=lista[i].cliente;
							c_name=lista[i].nombre1+" "+lista[i].nombre2;
							*/
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
						if( (page+1)*50>total){
							$(".next_page").hide();		
						}
						if(page==0)
							$(".prev_page").hide();
						$(".page-data span").text(	page+"/"+Math.ceil(total/50-1)	 );
						$("#loading").hide();
	    				$("#wrapper").show();
					}
					
				});
			}
		});
	}
}
function load_by_page(){
	window.location.replace("pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page="+page+"&tid="+tid+"&cid="+c_id+"&cname="+c_name);
}
function filter(){
	f_name=$("#filter").val();
	f_from=$("#dpick1 input").val();
	f_till=$("#dpick2 input").val();
	if(f_from == "" || f_till == ""){
		alert("Debe ingresar fecha inicial y fecha final.");
	}else{
		window.location.replace("pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&tid="+tid+"&filter="+f_name+"&from="+f_from+"&to="+f_till+"&cid="+c_id+"&cname="+c_name);
	}
	
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
		tid= params.parameters.tid;
		c_id=params.parameters.cid;
		c_name=params.parameters.cname;
		if(params.parameters.page!= undefined)
			page = params.parameters.page;

		if(params.parameters.filter!= undefined && params.parameters.from!= undefined && params.parameters.to!= undefined){
			filtered 	= params.parameters.filter;
			ffrom 		= params.parameters.from;
			fto 		= params.parameters.to;
		}


		state =1;

		// $("#headinguname").text(u_name);
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

		$('.datetimepicker').datetimepicker();

		$("#bt_filter").click(function(){
			filter();
		});
		$("#bt_cuenta").click(function(){
			window.location.replace("pass.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
		});
		$("#bt_clientes").click(function(){
			window.location.replace("main.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page=0");
		});
	}
});