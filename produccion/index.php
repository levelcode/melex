<?php
	session_start();
	if(!isset($_SESSION['user'])  ){
    	header("Location: login.php");
    	die();
	}
  include ("api/config.php");
  include ("api/helpers.php");
  include ("api/services.php");
  include ("controllers/tables.php");
	
  $name = get_user_name($_SESSION['user'] );
  $tablas = get_tables();


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
                        <li class="active">
                            <a href="index.php">Ver Tablas</a>
                        </li>
                        <li>
                            <a href="crear.php">Crear Tabla</a>
                        </li>
                        <!-- <li>
                            <a href="editar.php">Editar Tabla</a>
                        </li> -->
                    </ul>
                </li>
                <li><a href="asesores.php?logout=1"><i class="fa fa-fw fa-power-off"></i> Asesores</a></li>
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
                      <small>Tablas</small>
                  </h1>
                  <ol class="breadcrumb">
                      <li>
                          <i class="fa fa-table"></i>  <a href="index.php">Tablas</a>
                      </li>
                      <li class="active">
                          <i class="fa fa-file"></i> Ver tablas
                      </li>
                  </ol>
              </div>
          </div>
          <!-- /.row -->




          <div class="row">
            <div class="col-md-12">
              <div class="panel panel-default">
                  <!-- Default panel contents -->
                  <div class="panel-heading" id="nombre_tabla">Tablas</div>
                      <?php if (  $tablas == null ): ?>
                        <p>No hay tablas registradas en el sistema.</p>
                      <?php else: ?>

                      
                      <!-- Table -->
                      <table class="table" id="tabla1">
                            <tr>
                              <th>#</th>
                              <th>Editar</th>
                              <th>Nombre Interno</th>
                              <th>Nombre Público</th>
                              <th>Ícono</th>
                              <th>Orden</th>
                            </tr>
                            
                            <?php foreach ($tablas as $key => $value) : ?>

                              <tr id="tb_<?= $key ?>">
                                <td class="tdorder"><?= $value['orden'] ?></td>
                                <td><a href="editar.php?idt=<?= $key ?>"><button type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></a></td>
                                <td><?= $value['name'] ?></td>
                                <td><?= $value['publico'] ?></td>
                                <td><img width="50" height="50" src="img/icons/<?= getIcon($value['icono']) ?>" alt="icon"></td>
                                <td> 
                                  <div class="f_up flecha" ror="<?= $value['orden'] ?>" rel="<?= $key ?>"><i class="fa fa-caret-up"></i></div>
                                  <div class="f_down flecha" ror="<?= $value['orden'] ?>" rel="<?= $key ?>"><i class="fa fa-caret-down"></i></div>
                                </td>
                              </tr>
                            <?php endforeach; ?>
                            
                      </table>
                    <?php endif; ?>
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>


    <!-- jQuery -->
    <script src="js/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Js reorder tables -->
    <script src="js/reorder.js"></script>
</body> 
</html>