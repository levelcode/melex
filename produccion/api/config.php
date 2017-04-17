<?php
	$conn = null;
	$env = "DEBUG";

function connect_db(){
	global $conn;
	$conn = new mysqli('localhost', 'melexa_appSales', 'melexa_claveS1', 'melexa_appSales');
  	if ($conn->connect_errno) {
    	return false;
  	}
  	mysqli_set_charset($conn,"utf8");
  	return true;
}



