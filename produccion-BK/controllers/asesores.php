<?php	
	function echo_next_page_users($page){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");

	    if (  !$res = $conn->query("SELECT count(asesor) as total  FROM app_usuarios")   ) {
	      ShowDBerror($conn);
	    }
	    $act= $res->fetch_assoc();
	    $total = $act['total'];

		if(($page+1)*20<$total){
			echo "<a href='asesores.php?page=".($page+1)."' ><button class='bt_next_page'>siguiente</button></a>";
		}else{
			echo "<button class='bt_next_page' disabled>siguiente</button>";
		}
	}
	function echo_prev_page_users($page){
		if($page<=0){
			echo "<button class='bt_prev_page' disabled>anterior</button>";
		}else{
			echo "<a href='asesores.php?page=".($page-1)."' ><button class='bt_prev_page'>anterior</button></a>";
		}			
	}


	function get_all_users_by_pages($page){
		global $conn;
		if($conn == null)
			connect_db();
		if( $conn == null )
			dd("Error de Configuración");
		$users= null;
	    if (  !$res = $conn->query("SELECT asesor,usuario,nombre,activo  FROM app_usuarios LIMIT $page,20")   ) {
	      ShowDBerror($conn);
	    }

	    if($res->num_rows > 0){
	    	while($row = $res->fetch_assoc() ){
	    		$users[$row['asesor']] = $row;
	    	}
	    }
	    return $users;
	}
