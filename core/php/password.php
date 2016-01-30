<?php
	  include_once 'functions.php';
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    if ($check) {
        if (isset($_POST['id'], $_POST['password'])) {
            $personId = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
            $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
        }
        // generate salt
        $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
        // Create salted password 
        $password = hash('sha512', $password . $salt);
        
        $sql = "UPDATE `person` SET `password` = :password, `salt` = :salt, `updated` = :updated WHERE (`id` = :id)";
        $params = array(
            "id" => $personId,
            "password" => $password,
            "salt" => $salt,
            "updated" => date("Y-m-d H:i:s"),
        );
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            if ($stmt) {
                $stmt->execute($params);
                $params = array(
                    "result" => "true",
                );
                echo json_encode($params);
            }
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    } else {
        $params = array(
            "result" => "false",
        );
        echo json_encode($params);
    }
?>