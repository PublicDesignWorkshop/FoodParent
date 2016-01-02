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
        $params = null;
        if ($data != null) {
            $params = array(
                "trees" => $data->{'trees'},
                "size" => $data->{'size'},
                "offset" => $data->{'offset'},
            );
        } else {
            $params = array(
                "trees" => $_GET['trees'],
                "size" => $_GET['size'],
                "offset" => $_GET['offset'],
            );
        }
        $sql = "SELECT * FROM `note` WHERE (`tree` IN (".$params["trees"].")) ORDER BY `date` DESC LIMIT ".$params["size"]." OFFSET ".$params["offset"]."";
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