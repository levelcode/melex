<?php
	

	global $conn;
	connect_db();
	if( $conn == null )
		dd("Error de Configuración");
	
	if(!isset($_POST['login_user']) ||	!isset($_POST['login_password']) ){
		$msg = "Error: Datos Insuficientes.";
	}else{
		$iduser = validate_user($_POST['login_user'],$_POST['login_password'],$conn);
		if($iduser == 0)
			$msg = "Error: Datos Incorrectos.";
	}

function validate_user($user,$pass,$conn){
	$h = encript($pass);
	$query = "SELECT * FROM app_dashboard_users WHERE user = '$user' AND pass = '$h'";
    if (  !$res = $conn->query($query)   ) {
      ShowDBerror($conn);
    }
    if($res->num_rows === 1){
        $act = $res->fetch_assoc();
        return $act['id'];
    }else{
    	return 0;
    }

}