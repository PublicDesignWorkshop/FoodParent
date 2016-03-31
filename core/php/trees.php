<?php
    include_once 'functions.php';
    
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    
    
    

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
        
        
        $check = admin_check();
        if ($check) {
            
            
            if ($data != null) {
                $params = array(
                    "mode" => $data->{'mode'},
                    "id" => $data->{'id'},
                    "north" => $data->{'north'},
                    "south" => $data->{'south'},
                    "west" => $data->{'west'},
                    "east" => $data->{'east'},
                );
            } else {
                $params = array(
                    "mode" => $_GET['mode'],
                    "id" => $_GET['id'],
                    "north" => $_GET['north'],
                    "south" => $_GET['south'],
                    "west" => $_GET['west'],
                    "east" => $_GET['east'],
                );
            }
            /*
            if ($params["id"] != -1) {
                $sql = "SELECT * FROM `tree` WHERE (`id` = '".$params["id"]."')";
            } else {
                $sql = "SELECT * FROM `tree` WHERE (`lat` BETWEEN ".$params["south"]." AND ".$params["north"].") AND (`lng` BETWEEN ".$params["west"]." AND ".$params["east"].")";
            }
            */
            $sql = "SELECT * FROM `tree`";
        
        
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
            
            
        } else {
            
            if ($data != null) {
                $params = array(
                    "mode" => $data->{'mode'},
                    "id" => $data->{'id'},
                    "north" => $data->{'north'},
                    "south" => $data->{'south'},
                    "west" => $data->{'west'},
                    "east" => $data->{'east'},
                );
            } else {
                $params = array(
                    "mode" => $_GET['mode'],
                    "id" => $_GET['id'],
                    "north" => $_GET['north'],
                    "south" => $_GET['south'],
                    "west" => $_GET['west'],
                    "east" => $_GET['east'],
                );
            }
            /*
            if ($params["id"] != -1) {
                $sql = "SELECT * FROM `tree` WHERE (`id` = '".$params["id"]."' AND `ownership` = '1')";
            } else {
                $sql = "SELECT * FROM `tree` WHERE (`lat` BETWEEN ".$params["south"]." AND ".$params["north"].") AND (`lng` BETWEEN ".$params["west"]." AND ".$params["east"]." AND `ownership` = '1')";
            }
            */
            $sql = "SELECT * FROM `tree` WHERE (`ownership` = 1)";
        
        
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
    }
?>