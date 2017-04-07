<?php
	

/* *** *** */
	// Validacion de usuario para la app si existe y si está habilitado.
	function valid_app_user($conn,$user,$pass){
		//echo "entramos ".$user;
		if($user == "" || $pass == "")
			return null;
		else{
			$hash = encript($pass);
			//echo $hash;
			$query = "SELECT * FROM app_usuarios WHERE usuario = '$user' AND hash_app = '$hash' AND activo=1 ";
		    if (  !$res = $conn->query($query)   ) {
		      ShowDBerror($conn);
		    }
		    
		    if($res->num_rows === 1){
		        $act = $res->fetch_assoc();
		        return $act;
		    }else{
		    	//echo "mas de uno";
		    	return null;
		    }
		}	
	}

	function generate_app_token($conn,$userid){
		$token=null;
		$token = generate_token();
		//echo $token;
		if (  !$res = $conn->query("UPDATE app_usuarios SET app_token = '$token' WHERE asesor = '$userid'")   ) {
		     ShowDBerror($conn);
			return null;
		}
		return $token;
	}




	// Devuelve las tablas del sistema.
	function getTables($conn){
		$query = "SELECT *  FROM app_dashboard_tables ";
		$tables = null;
	    if (  !$res = $conn->query($query)   ) {
	      ShowDBerror($conn);
	    }
	    if($res->num_rows >0){
	    	while($row = $res->fetch_assoc() ){
	    		$tables[$row['id']] = $row;
	    	}
	    }
		return $tables;
	}
	function getTablesByOrder($conn){
		$query = "SELECT *  FROM app_dashboard_tables ORDER BY orden ";
		$tables = null;
	    if (  !$res = $conn->query($query)   ) {
	      ShowDBerror($conn);
	    }
	    if($res->num_rows >0){
	    	while($row = $res->fetch_assoc() ){
	    		$tables[$row['id']] = $row;
	    	}
	    }
		return $tables;
	}
	// Devuelve los datos administrativos de una tabla
	function getTableInfo($conn,$tId){
		$res= $conn->query("SELECT * FROM app_dashboard_tables WHERE id = $tId");
		$row = $res->fetch_assoc();
		if($row['activo'] == 0)
			$row['activo'] = "";
		else 
			$row['activo'] = "checked";

		return $row;
	}
	// Devuelve la estructura de una tabla.
	function getTableStructureSaved($conn,$tId){
		$res= $conn->query("SELECT campos FROM app_dashboard_tables WHERE id = $tId");
		$row = $res->fetch_assoc();
		return $row['campos'];
	}
	// Devuelve los nombres públicos para los campos.
	function getTablePublicNamesFields($conn,$tId){
		$res= $conn->query("SELECT campos_p FROM app_dashboard_tables WHERE id = $tId");
		$row = $res->fetch_assoc();
		return $row['campos_p'];
	}

	function getTableStructure($conn,$tname){
		$res= $conn->query("SHOW COLUMNS FROM $tname");
		$fields=[];
		while($row= $res->fetch_assoc() ){
			$fields[]=$row['Field'];
		}
		return $fields;
	}




	/********** begin methos for clients **************/
	function get_total_clients_for($conn,$userid){
		$query="SELECT COUNT(cliente) AS cantidad FROM app_perfilcliente WHERE asesor='$userid'";
		if (  !$res = $conn->query($query)   ) 
	      ShowDBerror($conn);
		$row= $res->fetch_assoc();
		return $row['cantidad'];
	}
	function get_clients_for($conn,$cid){
		$query="SELECT cliente,nit,nombre1,nombre2,direccion1,direccion2,ciudad,telefono1,telefono2 FROM app_perfilcliente WHERE cliente='$cid' ";
		$fields=[];
		if (  !$res = $conn->query($query)   ) 
	      ShowDBerror($conn);
		$row= $res->fetch_assoc();
		$fields[]=$row;
		return $fields;	
	}
	function get_brief_clients($conn,$userid,$page){
		$pag=$page*50;
		$query="SELECT cliente,nombre1,nombre2 FROM app_perfilcliente WHERE asesor='$userid' ORDER BY nombre1 ASC LIMIT $pag,50";
		$fields=[];
		if (  !$res = $conn->query($query)   ) 
	      ShowDBerror($conn);
		while($row= $res->fetch_assoc() ){
			$fields[]=$row;
		}
		return $fields;	
	}
	function get_clients_by_name($conn,$userid,$term){
		$query="SELECT cliente,nombre1,nombre2 FROM app_perfilcliente WHERE asesor='$userid' AND nombre1 like '%$term%' LIMIT 50";
		//var_dump($query);
		$fields=[];
		if (  !$res = $conn->query($query)   ) 
	      ShowDBerror($conn);
		while($row= $res->fetch_assoc() ){
			$fields[]=$row;
		}
		//var_dump($fields);
		return $fields;	
	}
	function get_clients_by_id($conn,$userid,$term){
		$query="SELECT cliente,nombre1,nombre2 FROM app_perfilcliente WHERE asesor='$userid' AND cliente like '%$term%' LIMIT 50";
		//var_dump($query);
		$fields=[];
		if (  !$res = $conn->query($query)   ) 
	      ShowDBerror($conn);
		while($row= $res->fetch_assoc() ){
			$fields[]=$row;
		}
		//var_dump($fields);
		return $fields;	
	}
	function get_clients_name_by_term($conn,$userid,$term){
		$q="SELECT nombre1 FROM app_perfilcliente WHERE asesor='$userid' AND nombre1 like '%$term%' LIMIT 5";
		$fields=[];
		if (  !$res = $conn->query($q)   ) 
	      ShowDBerror($conn);
	  	while($row = $res->fetch_assoc() ){
	  		$fields[]=$row['nombre1'];
	  	}
		return $fields;
	}
	/********** end methos for clients **************/





	// Devuelve las tablas activas, id, nombre interno y externo
	function get_active_tables($conn){
		$query="SELECT id,name,publico,icono FROM app_dashboard_tables WHERE activo=1 ORDER BY orden ASC";
		$tables=[];
		if (  !$res = $conn->query($query)   ) {
	      ShowDBerror($conn);
	    }else{
			while($row=$res->fetch_assoc() ){
				$tables[]=$row;
			}
		}
		return $tables;
	}
	//Campos habilitados para ser mostrados al usuario
	function get_table_headers_active($conn,$tId){
		$res=$conn->query("SELECT campos FROM app_dashboard_tables WHERE id=$tId ");
		$row = $res->fetch_assoc();
		return $row['campos'];
	}
	

	function get_table_datetime($conn, $tId){
		$tname = get_table_real_name($conn,$tId);
		$q = "SELECT * from " .$tname." LIMIT 1";

		if($result = $conn->query($q)){
			$fields=[];
		    while ($column_info = $result->fetch_field()){
		        $type=$column_info->type;
		        if($type == 12 ||$type == 10 ||$type == 7 ||$type == 11){
					//echo $column_info->name."<br>";
					$fields[]=$column_info->name;
		        }
		    }
		    
		    return $fields;
		}
		else{
			return null;
		}
		
	}
	function get_table_real_name($conn,$id){
		$res=$conn->query("SELECT name FROM app_dashboard_tables WHERE id=$id ");
		$row = $res->fetch_assoc();
		return $row['name'];
	}

	// Datos de una tabla paginados. 
	function getTableData($conn,$tId,$uId,$page,$num_rows){
		$cols= get_table_headers_active($conn,$tId);
		$cols_public= getTablePublicNamesFields($conn,$tId);

		$tname = get_table_real_name($conn,$tId);
		$pag=$page*$num_rows;
		if ( !$res=$conn->query("SELECT * FROM $tname WHERE cliente='$uId' LIMIT $pag ,$num_rows ")){
			ShowDBerror($conn);
			return false;
		}else{
			$data=[];
			$cols = str_replace("'","\"", $cols);
			$cols = json_decode($cols,true);

			$cols_p = str_replace("'","\"", $cols_public);
			$cols_p = json_decode($cols_p,true);

			$data[]=$cols["Campos"];
			for( $i=0;$i< count( $data[0] ); $i++ )
			{
				if($cols_p[$data[0][$i]]){
					$temp = $cols_p[$data[0][$i]];
					//echo "<p>campo encontrado: ".$cols_p[$data[0][$i]]."</p>";
					$data[0][$i] = $temp;
				}
			}
			//$data[]=$cols_p;

			while($row=$res->fetch_assoc() ){
				$row_cut=[];
				for($i=0;$i<count(		$cols["Campos"] 	);$i++ ){
					$row_cut[]=	$row[$cols["Campos"][$i]];
				}
				$data[]=$row_cut;
			}
			return $data;
		}
	}
	// Total datos de una tabla
	function getTotalTableData($conn,$tId,$uId){
		$tname = get_table_real_name($conn,$tId);
		if ( !$res=$conn->query("SELECT COUNT(*) AS cantidad FROM $tname WHERE cliente='$uId'")){
			ShowDBerror($conn);
			return false;
		}else{
			$row= $res->fetch_assoc();
		return $row['cantidad'];
		}
	}


	/******* begins get table data filtered by a date *************/
	function getTableDataFilter($conn,$tId,$uId,$page,$num_rows,$filter,$max,$min){
		$cols= get_table_headers_active($conn,$tId);
		$tname = get_table_real_name($conn,$tId);
		$pag=$page*$num_rows;
		$startDate = date("Y-m-d", strtotime($min));
		$endDate = date("Y-m-d", strtotime($max));
		$q="SELECT * FROM $tname WHERE cliente='$uId' AND ($filter BETWEEN '$startDate' AND '$endDate') LIMIT $pag ,$num_rows ";
		//var_dump($q);
		if ( !$res=$conn->query($q)){
			ShowDBerror($conn);
			return false;
		}else{
			$data=[];
			$cols = str_replace("'","\"", $cols);
			$cols = json_decode($cols,true);
			$data[]=$cols["Campos"];

			while($row=$res->fetch_assoc() ){
				$row_cut=[];
				for($i=0;$i<count(		$cols["Campos"] 	);$i++ ){
					$row_cut[]=$row[$cols["Campos"][$i]];
				}
				$data[]=$row_cut;
			}
			return $data;
		}
	}
	// Total datos de una tabla
	function getTotalTableDataFilter($conn,$tId,$uId,$filter,$max,$min){
		$tname = get_table_real_name($conn,$tId);
		$startDate = date("Y-m-d", strtotime($min));
		$endDate = date("Y-m-d", strtotime($max));
		$q="SELECT COUNT(*) AS cantidad FROM $tname WHERE (cliente='$uId') AND ($filter BETWEEN '$startDate' AND '$endDate')";
		//var_dump($q);
		if ( !$res=$conn->query($q)){
			ShowDBerror($conn);
			return $q;
		}else{
			$row= $res->fetch_assoc();
		return $row['cantidad'];
		}
	}
	/******* ends get table data filtered by a date *************/




	function updateTable($conn,$name,$public,$icon,$tId,$active){
		$activo=0;
		if($active == 'on')
			$activo = 1;
		if($icon=="")
			$q="UPDATE app_dashboard_tables SET name='$name',publico='$public',activo=$activo WHERE id=$tId";
		else
			$q="UPDATE app_dashboard_tables SET name='$name',publico='$public',activo=$activo,icono='$icon' WHERE id=$tId";

		if ($r = $conn->query($q) ) 
			return 1;
		else{
			//ShowDBerror($conn);
			return 0;
		}
	}

	// actualiza los campos activos
	function update_field_activation($conn,$tId,$fname,$val){

		$indb = getTableStructureSaved($conn,$tId);
		$indb = str_replace("'","\"", $indb);
		$indb = json_decode($indb,true);
		
		//dd($indb);
		
		if($val == 0){
			if(in_array($fname,$indb['Campos']) ){
				//$indb['Campos']
				//dd($indb);
				$index = array_search($fname, $indb['Campos']);
				array_splice($indb['Campos'], $index, 1);

			}
		}else{
			if(!in_array($fname,$indb['Campos']) ){
				$indb['Campos'][] = $fname;
				//dd($indb);
			}
		}
		$indb = json_encode($indb);
		//$indb = str_replace("\"","'", $indb);
		//dd($indb);
		$conn->query("UPDATE app_dashboard_tables SET campos='$indb' WHERE id=$tId");
		ShowDBerror($conn);
	}
	// actualiza el nombre publico de los campos
	function update_field_public_name($conn,$tId,$fname,$val){
		$pdb = getTablePublicNamesFields($conn,$tId);
		echo "uno ".$pdb;
		if($pdb == null){
			$pdb[$fname]=$val;
		}else{
			$pdb = str_replace("'","\"", $pdb);
			$pdb = json_decode($pdb,true);
			$pdb[$fname]=$val;
		}
		$outdb = 	json_encode($pdb);
		$conn->query("UPDATE app_dashboard_tables SET campos_p='$outdb' WHERE id=$tId");
		ShowDBerror($conn);	
	}


	// guarda en la base de datos el nombre raw de la tabla, nombre public y url de icono, y retorna el id con el que ha quedado
	function setTable($conn,$n_r,$n_p,$n_icon){
		$ide = 0;
		$q= "INSERT INTO app_dashboard_tables (name,publico,icono) VALUES ('$n_r','$n_p','$n_icon')";
		//dd($q);
		if ($r = $conn->query($q) ) {
		   $ide= $conn->insert_id;
		   setOrder($conn,$ide,$ide);
		}
		return $ide;
	}
	
	function setOrder($conn,$tId,$oId){
		$q = "UPDATE app_dashboard_tables SET orden=$oId WHERE id=$tId";
		$conn->query($q);
	}

	function swapOrder($conn,$tId,$oId){
		$otherid= 0;
		$otherorder=0;
		if($res = $conn->query("SELECT  id FROM app_dashboard_tables WHERE orden = $oId") ){
			if($res->num_rows >0){
		    	while($row = $res->fetch_assoc() ){
		    		$otherid = $row['id'];
		    	}
		    }
		}
		if($otherid>0){
			if($res = $conn->query("SELECT  orden FROM app_dashboard_tables WHERE id = $tId") ){
				if($res->num_rows >0){
		    		while($row = $res->fetch_assoc() ){
		    			$otherorder = $row['orden'];
		    		}
		    	}
			}
			$q = "UPDATE app_dashboard_tables SET orden=$otherorder WHERE id=$otherid";
			$conn->query($q);
		}

		$q = "UPDATE app_dashboard_tables SET orden=$oId WHERE id=$tId";
		//dd($q);
		$conn->query($q);
		//ShowDBerror($conn);
		return array($otherid,$otherorder);
	}


	function set_user_active($conn,$idu,$active){
		$q = "UPDATE app_usuarios SET activo=$active WHERE asesor='$idu'";
		$conn->query($q);
	}


	function set_user_new_pass($conn,$idu, $pass,$name ){
		
		if (  !$res = $conn->query("SELECT * FROM app_dashboard_users WHERE user = '$name' ")   ) {
      		ShowDBerror($conn);
		
    	}else if($res->num_rows > 0){

    		$q = "UPDATE app_usuarios SET hash_app='$pass' WHERE asesor='$idu'";
			$conn->query($q);
			//ShowDBerror($conn);
    	}else{
    		echo "error";
    	}
    }
