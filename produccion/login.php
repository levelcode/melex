<?php
  session_start();
  $_SESSION = array();
  if(isset($_REQUEST['logout'])){
    session_destroy();
  }
  $msg = "";
  $iduser = 0;
  if(isset($_POST['login_user'])    ||    isset($_POST['login_password'])     ){
    include ("api/helpers.php");
    include ("api/config.php");
    include("controllers/auth.php");
  }
  if($iduser>0){
    $_SESSION["user"] = $iduser;
    header("Location: index.php");
    die();
  }


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
    <!-- <link href="css/custom.css" rel="stylesheet" type="text/css"> -->

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style>
      input{
        padding-left:1em;
      }
    </style>
</head>
<body>
    <div id="wrapper" class="wrapper-login">
      <div id="page-wrapper">
        
        <div class="container-fluid text-center" class="container-login">
          <div class="row">
            <div class="col-lg-12">
              <img class="logo" src="img/logo.jpg" alt="">
            </div>
            <div class="col-lg-12">
              <h1>Dashboard Melexa</h1>
              <ol class="breadcrumb">
                <li><i class="fa fa-dashboard"></i> Bienvenido al administrador del Melexa Sales APP.<br> Ingrese su usuario y su contraseña a continuación.</li>
              </ol>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">



            <form action="<?= htmlentities($_SERVER['PHP_SELF']); ?>" method="post" role="form">

                  <div class="form-group input-group">
                      <span class="input-group-addon">Usuario</span>
                      <input type="text" class="form-control" name="login_user" placeholder="Ingrese su usuario">
                  </div>
                  <div class="form-group input-group">
                      <span class="input-group-addon">Contraseña</span>
                      <input type="password" class="form-control" name="login_password" placeholder="Ingrese su contraseña">
                  </div>

                  <button type="submit" class="btn btn-primary">Ingresar</button>
              </form>

              <?php/* 
              <form action="<?= htmlentities($_SERVER['PHP_SELF']); ?>" method="post" role="form">
                <div class="form-group input-group">
                  <span class="input-group-addon">Usuario</span>
                  <input class="form_control" id="login_user" name="login_user" type="text" required>
                </div>
                <div class="form-group input-group">
                  <span class="input-group-addon">Contraseña</span>
                  <input class="form_control" id="login_password" name="login_password" type="password" required>
                </div>
                
                <!-- <div class="form-group">
                  <p class="form-control-static">
                    <a href="recordar.php">Recordar Contraseña</a>
                  </p>
                </div> -->
                <div class="form-group">
                  <button type="submit" class="btn btn-default">Ingresar</button>
                </div>
                
              </form>
              */?>
              <form role="form">
                <div class="form-group has-error" style="margin-top: 2em;">
                    <label id="inputError" class="control-label" for="inputError"><?= $msg ?></label>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
</body>
</html>