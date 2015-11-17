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
            //create();
            break;
        case 'GET':
            //read();
            break;
        case 'PUT':
            update();
            break;
        case 'DELETE':
            //delete();
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
        $sql = "SELECT * FROM `tree` WHERE (`id` = :id)";
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
                "address" => $data->{'address'},
                "food" => $data->{'food'},
                "type" => $data->{'type'},
                "flag" => $data->{'flag'},
                "owner" => $data->{'owner'},
                "ownership" => $data->{'ownership'},
                "updated" => date("Y-m-d H:i:s"),
            );
        }
        $sql = "UPDATE `tree` SET `lat` = :lat, `lng` = :lng, `address` = :address, `food` = :food, `type` = :type, `flag` = :flag, `owner` = :owner, `ownership` = :ownership, `updated` = :updated WHERE (`id` = :id)";
        
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            $sql = "SELECT * FROM `tree` WHERE (`id` = :id)";
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
?>