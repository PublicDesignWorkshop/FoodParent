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
                "mode" => $data->{'mode'},        // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end
                "places" => $data->{'places'},
                "start" => $data->{'start'},
                "end" => $data->{'end'},
                "size" => $data->{'size'},
                "offset" => $data->{'offset'},
            );
        } else {
            $params = array(
                "mode" => $_GET['mode'],        // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end
                "places" => $_GET['places'],
                "start" => $_GET['start'],
                "end" => $_GET['end'],
                "size" => $_GET['size'],
                "offset" => $_GET['offset'],
            );
        }
        
        if ($params["mode"] == 0 || $params["mode"] == "0") {
            $sql = "SELECT * FROM `donation` WHERE (`place` IN (".$params["places"].")) ORDER BY `date` DESC LIMIT ".$params["size"]." OFFSET ".$params["offset"]."";
        } else if ($params["mode"] == 1 || $params["mode"] == "1") {
            $sql = "SELECT * FROM `donation` WHERE `place` IN (".$params["places"].") AND (`date` <= '".$params["end"]."') ORDER BY `date` ASC LIMIT ".$params["size"]." OFFSET ".$params["offset"]."";
            //$sql = "SELECT * FROM `donation` WHERE `place` IN (".$params["places"].") AND (`date` BETWEEN '".$params["start"]."' AND '".$params["end"]."') ORDER BY `date` ASC LIMIT ".$params["size"]." OFFSET ".$params["offset"]."";
            //$sql = "SELECT * FROM `donation` WHERE `place` IN (".$params["places"].") AND (`date` BETWEEN '".$params["start"]."' AND '".$params["end"]."') ORDER BY `date` ASC";
        }
        
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