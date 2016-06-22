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

    $bookToSave = new Book();
    $bookToSave->setTitle($_POST["title"]);
    $bookToSave->setAuthorName($_POST["authorName"]);
    $bookToSave->setDescription($_POST["desc"]);
    if($bookToSave->saveToDB($conn)){
        echo "Dodałem nową książkę";
    }
    else{
        echo "Nie udało się dodać książki";
    }
}
if($_SERVER["REQUEST_METHOD"]==="DELETE"){
    
    parse_str(file_get_contents("php://input"),$deleteQuery);
    $bookToDelete = new Book();
    $bookToDelete->loadFromDB($deleteQuery['id'], $conn);
    if($bookToDelete->deleteFromDB($conn)){
        echo "Książka została usunięta";
    }
    else{
        echo "Nie udało się usunąć książki";
    }
}
if($_SERVER["REQUEST_METHOD"]==="PUT"){

    parse_str(file_get_contents("php://input"),$putQuery);
    $bookToEdit = new Book();
    $bookToEdit->loadFromDB($putQuery['id'], $conn);
 
    if(strlen($putQuery['title'])>0){
        $bookToEdit->setTitle($putQuery['title']);
    }
    if(strlen($putQuery['authorName'])>0){
        $bookToEdit->setAuthorName($putQuery['authorName']);
    }
    if(strlen($putQuery['desc'])>0){
        $bookToEdit->setDescription($putQuery['desc']);
    }

    if($bookToEdit->saveToDB($conn)){
        echo "Uaktualniłem wpis o książce";
    }
    else{
        echo "Nie udało się uaktualnić wpisu";
    }
}