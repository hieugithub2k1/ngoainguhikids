<?php
namespace Models;
use Exception;
use mysqli;
class BaseModel{
    private $host;
    private $userName;
    private $password;
    private $databaseName;
    static private $instanconn = null;
    private $conn;

    function __construct()
    {
        $this->host = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
        $this->userName = $_ENV['DB_USERNAME'];
        $this->password = $_ENV['DB_PASSWORD'];
        $this->databaseName = $_ENV['DB_NAME'];
        try{
            $this->conn = new mysqli($this->host, $this->userName, $this->password, $this->databaseName);
            // $this->conn->set_charset("latin1");
            // $this->conn->set_charset("utf8mb4");
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        }catch(Exception $e){
            echo "<h2 style='color:red'> Connection failed: " . $e->getMessage() . "</h2>";
            die();
        }
    }

    static function getInstance(){
        if(self::$instanconn == null){
            self::$instanconn = new BaseModel();
        }
        return self::$instanconn->conn;
    }


}