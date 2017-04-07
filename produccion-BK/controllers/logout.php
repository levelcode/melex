<?php
	$_SESSION = array();
  	if(isset($_REQUEST['logout'])){
    	session_destroy();
  	}

