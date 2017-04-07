<?php 
	include ("config.php");
	include ("helpers.php");
	include ("services.php");
	header("Access-Control-Allow-Origin: *");
	global $conn;
	if($conn == null)
		connect_db();
	if( $conn == null )
		dd("Error de Configuración");


	$req="";
	if (		isset(		$_REQUEST['action']		)		 ) {
			$req = $_REQUEST['action'];
	}

	switch ($req) {
		// Ajax reponse for Dashboard *** -------------------------------------------------------
		case "fieldActivation":
			update_field_activation($conn,$_REQUEST['id_table'],$_REQUEST['fname'],$_REQUEST['active']);
			break;
		case "fieldPublic":
			update_field_public_name($conn,$_REQUEST['id_table'],$_REQUEST['fname'],$_REQUEST['fpublic']);
			break;

		case "swapOrder":
			if(!isset($_REQUEST['id_table'])||!isset($_REQUEST['order'])  ){
				var_dump($_REQUEST);
				echo json_encode(array("msg"=>"Error: No hay datos."));
				exit;
			}
			$afected = swapOrder($conn,$_REQUEST['id_table'],$_REQUEST['order']);
			echo json_encode(array("msg"=>"ok","otherAfected"=>$afected[0],"orderAfected"=>$afected[1]));
			exit;
			# code...
			break;





		// Responses for App  *** --------------------------------------------------------------
		case "login":
			if(		isset($_REQUEST['username']) 	&& 		isset($_REQUEST['password'])  	){
				if($userdata = valid_app_user($conn,$_REQUEST['username'],$_REQUEST['password']) ){

					$userid 	= 	$userdata['asesor'];
					if($token = generate_app_token($conn,$userid)){
						
						$username	=	$userdata['nombre'];
						echo json_encode(array("msg"=>"ok","token"=>$token,"userid"=>$userid,"username"=>$username ));
					}
					else{
						echo json_encode(array("msg"=>"error","detail"=>"Error generando Token." ));
					}
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Usuario no existente, no habilitado o datos incorrectos." ));
				}
			}
			else{
				echo json_encode(array("msg"=>"error","detail"=>"Deben llenarse todos los campos." ));
			}
			break;


		case "get_available_tables":
			if($tables = get_active_tables($conn) ){
				echo json_encode($tables);
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
			}
			break;
		case "get_table_name":
			if(	!isset($_REQUEST['tid'])){
				echo json_encode(array("msg"=>"error","detail"=>"Parámetros insuficientes." ));
			}else{
				$tId=$_REQUEST['tid'];
				if($name = get_table_real_name($conn,$tId) ) {
					echo json_encode(array("msg"=>"ok","name"=>$name ));
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}
			break;
		case "get_table_fields_head":
			if(	!isset($_REQUEST['tid'])){
				echo json_encode(array("msg"=>"error","detail"=>"Parámetros insuficientes." ));
			}else{
				if($heads = get_table_headers_active($conn,$_REQUEST['tid']) ){
					echo $heads;
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}
			break;

		case "get_table_fields_datetime":
			if(	!isset($_REQUEST['tid'])){
				echo json_encode(array("msg"=>"error","detail"=>"Parámetros insuficientes." ));
			}else{
				$heads = get_table_datetime($conn,$_REQUEST['tid']);

				echo json_encode($heads);
			}
			break;

		case "get_table_details":
			if(	!isset($_REQUEST['tid'])){
				echo json_encode(array("msg"=>"error","detail"=>"Parámetros insuficientes." ));
			}else{
				$page=0;
				$tId=$_REQUEST['tid'];
				$idclient=$_REQUEST['idclient'];
				if(isset($_REQUEST['page']) )
					$page=$_REQUEST['page'];
				if(			isset($_REQUEST['filter'])			){
					$filter=$_REQUEST['filter'];
					$max=$_REQUEST['max'];
					$min=$_REQUEST['min'];
					if($tables = getTableDataFilter($conn,$tId,$idclient,$page,50,$filter,$max,$min) ){
						echo json_encode($tables);
					}else{
						echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
					}
				}else{
					if($tables = getTableData($conn,$tId,$idclient,$page,50) ){
						echo json_encode($tables);
					}else{
						echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
					}
				}
				
			}
			break;
		case "get_total_data_in_table":
			if(	!isset($_REQUEST['tid'])){
				echo json_encode(array("msg"=>"error","detail"=>"Parámetros insuficientes." ));
			}else{
				$tId=$_REQUEST['tid'];
				if(			isset($_REQUEST['idclient'])			)
					$idclient=$_REQUEST['idclient'];

				if(			isset($_REQUEST['filter'])			){
					$filter=$_REQUEST['filter'];
					if(isset($_REQUEST['max'])		){
						$max=$_REQUEST['max'];
						$min=$_REQUEST['min'];
					}else if(isset($_REQUEST['from'])  ){
						$max=$_REQUEST['to'];
						$min=$_REQUEST['from'];
					}

					if($cantidad = getTotalTableDataFilter($conn,$tId,$idclient,$filter,$max,$min) ){
						echo json_encode(array("msg"=>"ok","cantidad"=>$cantidad ));
					}else{
						if($cantidad == 0){
							echo json_encode(array("msg"=>"ok","cantidad"=>$cantidad ) );
						}else{
							echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ) );
						}
					}
				}else{
					if($cantidad = getTotalTableData($conn,$tId,$idclient) ){
						echo json_encode(array("msg"=>"ok","cantidad"=>$cantidad ));
					}else{
						if($cantidad == 0){
							echo json_encode(array("msg"=>"ok","cantidad"=>$cantidad ) );
						}else{
							echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ) );
						}
					}
				}
			}
			break;

		case "get_total_clients":
			if(			isset(		$_REQUEST['iduser']		)		 ){
				$page =0;
				$userid=$_REQUEST['iduser'];
				//devuelvo numero total de clientes.
				if($cantidad = get_total_clients_for($conn,$userid) 	){
					echo json_encode(array("msg"=>"ok","cantidad"=>$cantidad ));
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Usuario no identificado." ));
			}
			break;
		case "get_clients_by_params":
			$clientid=$_REQUEST['cid'];
			//devuelvo perfil de cliente.
			if($clients = get_clients_for($conn,$clientid) 	){
				echo json_encode($clients);
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
			}
			break;
		case "get_expert":
			$clientid = $_REQUEST['cid'];
			if($tables = getTableData($conn,5,$clientid,0,20) 	){
				echo json_encode($tables);
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
			}

			break;
		case "get_brief_of_clients":
			if(			isset(		$_REQUEST['iduser']		)		 ){
				$page =0;
				$userid=$_REQUEST['iduser'];
				if(			isset($_REQUEST['page'])		){
					$page = $_REQUEST['page'];
				}
				//devuelvo 20 clientes.
				if($clients = get_brief_clients($conn,$userid,$page) 	){
					echo json_encode($clients);
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Usuario no identificado." ));
			}
			break;
		case "search_clients_by_name":
			if( isset($_REQUEST['iduser']) && isset($_REQUEST['query']) ){
				$userid=$_REQUEST['iduser'];
				$term=$_REQUEST['query'];
				//devuelvo 20 clientes sin paginación.
				if($clients = get_clients_by_name($conn,$userid,$term)	){
					echo json_encode($clients);
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Parametros insuficientes." ));
			}
			break;
		case "search_clients_by_id":
			if( isset($_REQUEST['iduser']) && isset($_REQUEST['query']) ){
				$userid=$_REQUEST['iduser'];
				$term=$_REQUEST['query'];
				//devuelvo 20 clientes sin paginación.
				if($clients = get_clients_by_id($conn,$userid,$term)	){
					echo json_encode($clients);
				}else{
					echo json_encode(array("msg"=>"error","detail"=>"Problema en la base de datos." ));
				}
			}else{
				echo json_encode(array("msg"=>"error","detail"=>"Parametros insuficientes." ));
			}
			break;
		case "autocomplete_clients":
			if( isset($_REQUEST['iduser']) && isset($_REQUEST['query']) ){
				$userid=$_REQUEST['iduser'];
				$term=$_REQUEST['query'];
				$clients = get_clients_name_by_term($conn,$userid,$term);
				echo json_encode($clients);
			}else{
				echo json_encode(array("error"));
			}
			break;

		case "set_active":
			if(   !isset($_REQUEST['idu'])  || !isset($_REQUEST['active'])    ){
		          die ('[{ "msg":"Error : Datos Insuficientes" }]');
		      }
		      $idu = $_REQUEST['idu'];
		      $active = $_REQUEST['active'];

		      set_user_active($conn,$idu, $active );

		      echo '[{"msg":"ok","ide":"'.$idu.'"}]';

		      break;

		case "set_new_clave":
			if(   !isset($_REQUEST['idu'])  || !isset($_REQUEST['clave'])  || !isset($_REQUEST['name'])    ){
		          die ('[{ "msg":"Error : Datos Insuficientes" }]');
		      }
		      $idu = $_REQUEST['idu'];
		      $pass = encript(	$_REQUEST['clave']	);
		      $name = $_REQUEST['name'];

		      set_user_new_pass($conn,$idu, $pass,$name );

		      echo '[{"msg":"ok","ide":"'.$idu.'"}]';

		      break;
		case "logout":
			# code...
			break;




		case "encrypt":
			$resp = "Parámetro No existente.";
			if(isset($_REQUEST['pass']) ){
				$resp = encript($_REQUEST['pass']);
			}
			echo $resp;
			break;
		default:
			echo "sneaky bro";
			break;
	}
