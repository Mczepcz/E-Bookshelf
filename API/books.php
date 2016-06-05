<?php
require_once("./src/conn.php");
require_once ("./src/book.php");
header("Access-Control-Allow-Origin: *");

if($_SERVER["REQUEST_METHOD"]=== "GET"){
    if(isset($_GET["id"])){
        $bookToShow = new Book();
        $bookToShow->loadFromDB($_GET["id"], $conn);
        $bookToShowJSON = json_encode($bookToShow->toArray());
        echo($bookToShowJSON);
           
    }
    else{
        $allBookNames = Book::GetBooksNames($conn);
        $allBookNamesJSON = json_encode($allBookNames);
        echo("$allBookNamesJSON");
    }
    
}
if($_SERVER["REQUEST_METHOD"]=== "POST"){
    
}