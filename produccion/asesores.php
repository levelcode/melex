<?php
	session_start();
	if(!isset($_SESSION['user'])  ){
    	header("Location: login.php");
    	die();
	}
  include ("api/config.php");
  include ("api/helpers.php");
  include ("api/services.php");
  include ("controllers/asesores.php");

	$name = get_user_name($_SESSION['user'] );
  $page = 0;
  if(isset($_GET['page']) )
    if(is_numeric($_GET['page']) )
      $page = $_GET['page'];
  $t = get_all_users_by_pages($page); 

?>



<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Dashboard Melexa</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/sb-admin.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="css/bootstrap-datetimepicker.css" rel="stylesheet" type="text/css">
    <link href="css/custom.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div id="wrapper">
      <div id="page-wrapper">
        <nav class="navbar navbar-inverse">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="index.php">MELEXA</a>
            </div>

             <!-- Top Menu Items -->
            <ul class="nav navbar-right top-nav">
                
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <?= $name ?> <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li>
                            <a href="#perfil.php"><i class="fa fa-fw fa-user"></i> Perfil</a>
                        </li>
                        <li>
                            <a href="login.php?logout=1"><i class="fa fa-fw fa-power-off"></i> Log Out</a>
                        </li>
                    </ul>
                </li>
            </ul>

            <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
              <ul class="nav navbar-nav side-nav">

                <li >
                    <a href="javascript:;" data-toggle="collapse" data-target="#tablas"><i class="fa fa-fw fa-table"></i> Tablas<i class="fa fa-fw fa-caret-down"></i> </a>
                    <ul id="tablas" class="collapse">
                        <li >
                            <a href="index.php">Ver Tablas</a>
                        </li>
                        <li class="active">
                            <a href="crear.php">Crear Tabla</a>
                        </li>
                        <!-- <li>
                            <a href="editar.php">Editar Tabla</a>
                        </li> -->
                    </ul>
                </li>
                <li class="active"><a href="asesores.php?logout=1"><i class="fa fa-fw fa-power-off"></i> Asesores</a></li>
                <li>
                    <a href="login.php?logout=1"><i class="fa fa-fw fa-power-off"></i> Salir</a>
                </li>
              </ul>
            </div>
            <!-- /.navbar-collapse -->
        </nav>
        <div class="container-fluid">
          <!-- Page Heading -->
          <div class="row">
              <div class="col-lg-12">
                  <h1 class="page-header">
                      Dashboard
                      <small>Asesores</small>
                  </h1>
                  <ol class="breadcrumb">
                      <li>
                          <i class="fa fa-table"></i>  <a href="asesores.php">Asesores</a>
                      </li>
                      <li class="active">
                          <i class="fa fa-file"></i> Ver Asesores
                      </li>
                  </ol>
              </div>
          </div>
          <!-- /.row -->




          <div class="row">
            <div class="col-md-12">
              <div class="panel panel-default">
                <!-- Default panel contents -->
                 <?= echo_prev_page_users($page); ?>
                 <?= echo_next_page_users($page); ?>
                  <div class="panel-heading" id="nombre_tabla">Asesores</div>
                      <?php if (  $t == null ): ?>
                        <p>No hay Asesores registrados en el sistema.</p>
                      <?php else: ?>

                      
                      <!-- Table -->
                      <table class="table" id="tabla1">
                            <tr>
                              <th>#</th>
                              <th>Usuario</th>
                              <th>Nombre</th>
                              <th>Activo</th>
                              <th>Clave</th>
                            </tr>
                            
                            <?php foreach ($t as $key => $value) : ?>
                              <?php if($value['activo']==1)$value['activo']="checked" ?>
                              <tr>
                                <td><?= $key ?></td>
                                <td><?= $value['usuario'] ?></td>
                                <td><?= $value['nombre'] ?></td>
                                <td><input class="active_input" rel="<?= $key ?>" type="checkbox" <?= $value['activo']?>></td>
                                <td><button class="bt_np" rel="<?= $key ?>"> Clave</button></td>
                            <?php endforeach; ?>
                            
                      </table>
                    <?php endif; ?>
                  <?= echo_prev_page_users($page); ?>
                  <?= echo_next_page_users($page); ?>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div id="nueva_clave">
      <div>
        <h2>Nueva Clave</h2>
        <div class="row">
          <label for="">Digite su nombre de usuario</label>
          <input type="text" id="username">
        </div>
        <div class="row">
          <label for="">Digite la nueva clave de usuario</label>
          <input type="password" id="nclave">
        </div>
        <div class="row">
          <label for="">Confirmar clave</label>
          <input type="password" id="cclave">
        </div>
        <input type="hidden" id="pool" value="">
        <div class="row">
            <button id="guardar_np">Guardar</button>
        </div>
        <div class="row">
            <button id="cerrar_np">Cerrar</button>
        </div>

        
      </div>
    </div>
    <!-- jQuery -->
    <script src="js/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <script src="js/asesores.js" ></script>
</body>
</html>