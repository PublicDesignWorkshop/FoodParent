<?php
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    
    require('database.php');	
    function getConnection() {
        $db = new database;
        $dbhost = $db->host;
        $dbport = $db->port;
        $dbuser = $db->username;
        $dbpass = $db->password; 
        $dbname = $db->db_name;
        $dbh = new PDO("mysql:host=$dbhost;port=$dbport;dbname=$dbname", $dbuser, $dbpass);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    }

    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            //update();
            break;
        case 'GET':
            read();
            break;
        case 'PUT':
            //update();
            break;
        case 'DELETE':
            //delete();
            break;
    }
    
    function read() {
        $data = json_decode(file_get_contents('php://input'));
        if ($data != null) {
            $params = array(
                "mode" => $data->{'mode'},
                "id" => $data->{'id'},
            );
        } else {
            $params = array(
                "mode" => $_GET['mode'],
                "id" => $_GET['id'],
            );
        }        
        /*
        if ($params["id"] != -1) {
            $sql = "SELECT * FROM `donations` WHERE (`id` = '".$params["id"]."')";
        } else {
            $sql = "SELECT * FROM `donations` WHERE (`lat` BETWEEN ".$params["south"]." AND ".$params["north"].") AND (`lng` BETWEEN ".$params["west"]." AND ".$params["east"].")";
        }
        */
        $sql = "SELECT * FROM `donations`";
        
        
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
            $pdo = null;
            echo json_encode($result);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
?>