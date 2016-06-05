<?php
require_once(__DIR__."/book.php");

$DBusername = "root";
$DBpassword = "coderslab";
$DBadress = "localhost";
$DBname = "bookshelf";

$conn= new mysqli($DBadress, $DBusername, $DBpassword, $DBname);

if($conn->connect_error){
    die("Polaczenie nieudane. Blad: ".$conn->connect_error);
}

