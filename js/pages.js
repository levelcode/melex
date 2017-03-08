var u_id,u_name,token;
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
            alert("Error de conexión.");
        }else{
        	for(i=0 ; i< data.length ; i++){
        		m_tid=data[i].id;
        		m_tn=data[i].name;
        		m_tp=data[i].publico;
        		if(m_tid == tid){
        			$(".page-header h1").text(m_tp);
        		}
        		$("#menu").append("<li><a href='pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&tid="+m_tid+"'><i class='fa fa-table'></i> "+m_tp+"</a></li>");
        	}
           	loadTimeHeaders();
        }

    },"json");
}
function loadTimeHeaders(){
	$.post( urlA,{action:"get_table_fields_datetime",tid:tid}, function( data ) {
        if(data.msg == "error"){
            alert("Error de conexión.");
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
		$.post(urlA,{action:"get_total_data_in_table",tid:tid,iduser:u_id},function(data){
			if(data.msg == "error"){
				alert("Error de conexión.");
			}else{
				total = $.parseJSON(data).cantidad;
				$.post(urlA,{action:"get_table_details",tid:tid,iduser:u_id,page:page},function(d){
					if(d.msg == "error"){
						alert("Error de conexión.");
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
	else{
		$("#filter").val(filtered);
		$("#dpick1 input").val(ffrom);
		$("#dpick2 input").val(fto);
		$.post(urlA,{action:"get_total_data_in_table",tid:tid,iduser:u_id,filter:filtered,min:ffrom,max:fto},function(data){
			if(data.msg == "error"){
				alert("Error de conexión.");
			}else{
				$("#loading").hide();
	    		$("#wrapper").show();
				total = $.parseJSON(data).cantidad;
				$.post(urlA,{action:"get_table_details",tid:tid,iduser:u_id,page:page,filter:filtered,min:ffrom,max:fto},function(d){
					if(d.msg == "error"){
						alert("Error de conexión.");

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
	window.location.replace("pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&page="+page+"&tid="+tid);
}
function filter(){
	f_name=$("#filter").val();
	f_from=$("#dpick1 input").val();
	f_till=$("#dpick2 input").val();
	if(f_from == "" || f_till == ""){
		alert("Debe ingresar fecha inicial y fecha final.");
	}else{
		window.location.replace("pages.html?t="+token+"&uid="+u_id+"&uname="+u_name+"&tid="+tid+"&filter="+f_name+"&from="+f_from+"&to="+f_till);
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
		if(params.parameters.page!= undefined)
			page = params.parameters.page;

		if(params.parameters.filter!= undefined && params.parameters.from!= undefined && params.parameters.to!= undefined){
			filtered 	= params.parameters.filter;
			ffrom 		= params.parameters.from;
			fto 		= params.parameters.to;
		}


		state =1;

		$("#headingname").text(u_name);
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
	}
});