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
            create();
            break;
        case 'GET':
            //read();
            break;
        case 'PUT':
            update();
            break;
        case 'DELETE':
            delete();
            break;
    }
    
    function read() {
        $data = json_decode(file_get_contents('php://input'));
        $params = null;
        if ($data != null) {
            $params = array(
                "id" => $data->{'id'},
            );
        } else {
            $params = array(
                "id" => $_GET['id'],
            );
        }
        $sql = "SELECT * FROM `place` WHERE (`id` = :id)";
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
            $pdo = null;
            echo json_encode($result);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
    
    function update() {
        $data = json_decode(file_get_contents('php://input'));
        $params = null;
        if ($data != null) {
            $params = array(
                "id" => $data->{'id'},
                "lat" => $data->{'lat'},
                "lng" => $data->{'lng'},
                "name" => $data->{'name'},
                "description" => $data->{'description'},
                "updated" => date("Y-m-d H:i:s"),
            );
        }
        $sql = "UPDATE `place` SET `lat` = :lat, `lng` = :lng, `name` = :name, `description` = :description, `updated` = :updated WHERE (`id` = :id)";
        
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            $sql = "SELECT * FROM `place` WHERE (`id` = :id)";
            $params = array(
                "id" => $data->{'id'},
            );
            
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $result = $stmt->fetch();
                $pdo = null;
                echo json_encode($result);
            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
                
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
    
    function create() {
        $data = json_decode(file_get_contents('php://input'));
        $params = array(
            "lat" => $data->{'lat'},
            "lng" => $data->{'lng'},
            "name" => $data->{'name'},
            "description" => $data->{'description'},
            "updated" => date("Y-m-d H:i:s"),
        );
        $sql = "INSERT INTO `place` VALUES ( NULL, :name, :description, :lat, :lng, :updated )";
        
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            $sql = "SELECT * FROM `place` WHERE `id` = :id";
            $params = array(
                "id" => $pdo->lastInsertId(),
            );
            try {
               $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $result = $stmt->fetchAll(PDO::FETCH_OBJ);
                $pdo = null;
                echo json_encode($result[0]);
            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
    
    function delete() {
        $data = json_decode(file_get_contents('php://input'));
        $params = array(
            "id" => $data->{'id'},
        );
        $sql = "DELETE FROM `place` WHERE (`id` = :id)";
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute($params);
            $pdo = null;
            echo json_encode($result);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
?>