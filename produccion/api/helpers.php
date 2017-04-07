<?php
	function encript($data){
	  $h = "salt1".$data;
	  $ha = hash('sha512', $h, false);
	  return $ha;
	}

	function dd($msg){
		global $env;
		if ($env == "DEBUG"){
			var_dump($msg);
			die();
		}
	}

	function ShowDBerror($con){
	  echo "Errno: " . $con->errno . "\n";
	  echo "Error: " . $con->error . "\n";
	  die();
	}

	function get_user_name($uId){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");

		$query = "SELECT user  FROM app_dashboard_users WHERE id = '$uId' ";
	    if (  !$res = $conn->query($query)   ) {
	      ShowDBerror($conn);
	    }
	    if($res->num_rows === 1){
	        $act = $res->fetch_assoc();
	        return $act['user'];
	    }else{
	    	return "";
	    }
	}

	function generate_token(){
		$token = 0;
		//$token = bin2hex(random_bytes(6));  php7
		$token = bin2hex(openssl_random_pseudo_bytes(4));
		//$token = customRand(16);
		return $token;
	}

	
