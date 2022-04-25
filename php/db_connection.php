<?php

$database_host = "dbhost.cs.man.ac.uk";
$database_user = "q10556rn";
$database_pass = "webproject";
$group_dbnames = array( "2021_comp10120_z13",);
$database_name = $group_dbnames[0];

$conn = new mysqli($database_host, $database_user, $database_pass,$database_name ) or die("Connect failed: %s\n". $conn -> error);


?>