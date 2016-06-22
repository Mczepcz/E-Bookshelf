<?php
require_once "conn.php";

class Book {
    static public function GetBooksNames(mysqli $conn){
        $ret = [];
        $sql = "SELECT id,name FROM Books";
        $result = $conn->query($sql);
        if($result->num_rows >0){
            while($row= $result->fetch_assoc()){
                $ret[]=$row;
            }
        }
        return $ret;
        
    }
    
    private $id;
    private $title;
    private $author_name;
    private $description;
    
    public function __construct() {
        $this->id = -1;
        $this->title = "";
        $this->author_name="";
        $this->description="";
    }
    public function getId(){
        return $this->id;
    }
    public function setTitle($newTitle){
        $this->title = $newTitle;
    }
    public function getTitle(){
        return $this->title;
    }
    public function setAuthorName ($author){
        $this->author_name = $author;
    }
    public function getAuthorName(){
        return $this->author_name;
    }
    public function setDescription($desc){
        $this->description = $desc;
    }
    public function getDescription(){
        return $this->description;
    }
    public function saveToDB(mysqli $conn){
        if($this->id === -1){
            $sql = "INSERT INTO Books(name, author_name, description) VALUES ('{$this->title}','{$this->author_name}','{$this->description}')";
            if($conn->query($sql)){
                $this->id = $conn->insert_id;
                return true;
            }
            return false;
        }
        else{
            $sql = "UPDATE Books SET name = '{$this->title}', author_name='{$this->author_name}', description ='{$this->description}' WHERE id = {$this->id}";
            if($conn->query($sql)){ 
                return true;
            }
            return false;
        }   
    }
    public function loadFromDB($id, mysqli $conn){
        $sql = "SELECT * FROM Books WHERE id = {$id}";
        $result = $conn->query($sql);
        if($result != false){
            if($result->num_rows === 1){
                $row = $result->fetch_assoc();
                $this->id = (int)$row["id"];
                $this->title = $row["name"];
                $this->author_name=$row["author_name"];
                $this->description=$row["description"];
                return true;
            } 
        }
        return false;
    }
    public function toArray(){
        $ret= [];
        $ret['id'] = $this->id;
        $ret['title'] = $this->title;
        $ret['author_name'] = $this->author_name;
        $ret['description'] = $this->description;
        return $ret;
    }
    public function deleteFromDB(mysqli $conn){
        $sql = "DELETE FROM Books WHERE id = {$this->id}";
        if($conn->query($sql)){
            return true;
        }
        else{
            return false;
        }
           
    }
}
