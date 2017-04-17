<?php 
	//llama al servicio y tranforma la salida para que sea compatible
	function get_tables(){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");

		$tables = getTablesByOrder($conn);

		return $tables;
	}

	//recibe una url para ser validada si esta vacia o no.
	function getIcon($ic){

		if($ic == ""){
			return "icon_network.png";
		}else{
			return $ic;
		}
	}
	// devuelve un arreglo con lo valores de la tabla
	function get_table_data($id){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");

		$info = getTableInfo($conn,$id);
		return $info;
	}
	function get_structure($id,$tname){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");

		$indb = getTableStructureSaved($conn,$id);
		$pdb= getTablePublicNamesFields($conn,$id);
		$outdb =getTableStructure($conn,$tname);
		
		$indb = str_replace("'","\"", $indb);
		$indb = json_decode($indb,true);
		//dd($indb);
		$structure = [];
		$i=0;
		if($pdb != null){
			$pdb = str_replace("'","\"", $pdb);
			$pdb = json_decode($pdb,true);
		}

		for($i = 0 ; $i < count($outdb); $i++){
			$campo= $outdb[$i];
			$p_name = $campo;
			if($pdb != null){
				
				/*if( in_array($campo,$pdb) ){
					$p_name=$pdb[$campo];
				}*/
				if($pdb[$campo]){
					$p_name= $pdb[$campo];
				}
				
			}

			if($indb["Campos"]!=""){
				if(in_array($campo,$indb["Campos"])){
					$structure[]=array($campo,"checked",$p_name);
				}else{
					$structure[]=array($campo,"",$p_name);
				}
			}else{
				$structure[]=array($campo,"",$p_name);
			}
		}
		
		return $structure;
	}


	function save_table(){

		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");
		if( $_POST['raw_name']== "" )
			return "Error, Debe llenar todos los campos.";
		if(	$_POST['public_name'] == ""		)
			$_POST['public_name'] = $_POST['raw_name'];

		$iconURL = "img/icons/";
		$iconImg = "icon_network.png";

		if( isset($_FILES["n_icon"]["name"]) ){
			if($_FILES["n_icon"]["name"] != ""){
				$target_file = $iconURL.basename($_FILES["n_icon"]["name"]);
				$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
				$check = getimagesize($_FILES["n_icon"]["tmp_name"]);
				if($check !== false) {
					if ($_FILES["n_icon"]["size"] > 500000) {
					   	return "Error, Tamaño de archivo excedido.";
					}
					if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
					&& $imageFileType != "gif" ) {
					    return "Error, Tipo de imagen no permitido.";
					}
					$target_file = $iconURL.$_POST['raw_name'].".".$imageFileType;

					if (move_uploaded_file($_FILES["n_icon"]["tmp_name"], $target_file)) {
						$iconImg = $_POST['raw_name'].".".$imageFileType;		        
				    } else {
				        return "Error, No se pudo subir el archivo de imagen.";
				    }
				}
			}
		}


		return setTable($conn,$_POST['raw_name'],$_POST['public_name'],$iconImg);
	}
	function update_info_table(){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");
		if( $_POST['e_interno']== "" )
			return "Error, Debe llenar todos los campos.";
		if(	$_POST['e_publico'] == ""		)
			$_POST['e_publico'] = $_POST['e_interno'];
		//dd($_POST);
		$iconURL = "img/icons/";
		$iconImg = "";
		$tId = $_GET['idt'];
		if( isset($_FILES["e_icon"]["name"]) ){
			if($_FILES["e_icon"]["name"] != ""){
				$target_file = $iconURL.basename($_FILES["e_icon"]["name"]);
				$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
				$check = getimagesize($_FILES["e_icon"]["tmp_name"]);
				if($check !== false) {
					if ($_FILES["e_icon"]["size"] > 500000) {
					   	return "Error, Tamaño de archivo excedido.";
					}
					if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
					&& $imageFileType != "gif" ) {
					    return "Error, Tipo de imagen no permitido.";
					}
					$target_file = $iconURL.$_POST['e_interno'].".".$imageFileType;

					if (move_uploaded_file($_FILES["e_icon"]["tmp_name"], $target_file)) {
						$iconImg = $_POST['e_interno'].".".$imageFileType;		        
				    } else {
				        return "Error, No se pudo subir el archivo de imagen.";
				    }
				}
			}
		}
		if(!isset($_POST['e_activo']) )
			$_POST['e_activo']="";

		return updateTable($conn,$_POST['e_interno'],$_POST['e_publico'],$iconImg,$tId,$_POST['e_activo']);

	}
	