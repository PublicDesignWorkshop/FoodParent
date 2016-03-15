<?php
	  include_once 'functions.php';
    sec_session_start(); // Our custom secure way of starting a PHP session.
    if (isset($_POST['contact'], $_POST['name'], $_POST['neighborhood'])) {
        $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
        $neighborhood = filter_input(INPUT_POST, 'neighborhood', FILTER_SANITIZE_STRING);
        $contact = filter_input(INPUT_POST, 'contact', FILTER_SANITIZE_EMAIL);
        $contact = filter_var($contact, FILTER_VALIDATE_EMAIL);
        if (!filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            $params = array(
                "code" => 803
            );
            echo json_encode($params);
            return;
        }
        // Check email already exists.
        $params = array(
            "contact" => $contact,
        );
        $sql = "SELECT `id`, `auth`, `name`, `neighborhood` FROM `person` WHERE (`contact` = :contact)";
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $result = $stmt->fetch();
            if ($stmt->rowCount() == 1) { // user exists
                $id = $result["id"];
                $auth = $result["auth"];
                $db_name = $result["name"];
                $db_neighborhood = $result["neighborhood"];
                
                if ($auth == 1 || $auth == "1" || $auth == 2 || $auth == "2") {
                    $params = array(
                        "code" => 804
                    );
                    echo json_encode($params);
                } else {
                    $sql = "UPDATE `person` SET `auth` = :auth, `name` = :name, `neighborhood` = :neighborhood, `updated` = :updated WHERE (`id` = :id)";
                    $params = array(
                        "id" => $id,
                        "auth" => $auth,
                        "name" => $name,
                        "neighborhood" => $neighborhood,
                        "updated" => date("Y-m-d H:i:s"),
                    );
                    if ($name == '' || $neighborhood == '') {
                        $params = array(
                            "id" => $id,
                            "auth" => $auth,
                            "name" => $db_name,
                            "neighborhood" => $db_neighborhood,
                            "updated" => date("Y-m-d H:i:s"),
                        );
                    } else {
                        if ($auth == 4 || $auth == "4") {
                            $params = array(
                                "id" => $id,
                                "auth" => 3,
                                "name" => $name,
                                "neighborhood" => $neighborhood,
                                "updated" => date("Y-m-d H:i:s"),
                            );
                        }
                    }
                    
                    try {
                        $pdo = getConnection();
                        $stmt = $pdo->prepare($sql);
                        if ($stmt) {
                            $stmt->execute($params);
                            //$result = $stmt->fetch();
                            if (login($contact, $contact) == true) {
                                $params = array(
                                    "result" => "true",
                                    "id" => $_SESSION['user_id'],
                                    "contact" => $_SESSION['contact'],
                                    "auth" => $_SESSION['user_auth'],
                                    "code" => 400,
                                );
                                echo json_encode($params);
                            } else {
                                $params = array(
                                    "code" => 805
                                );
                                echo json_encode($params);
                            }
                        }
                    } catch(PDOException $e) {
                        echo '{"error":{"text":'. $e->getMessage() .'}}';
                    }
                }
            } else {                      // add a new user
                // generate salt
                $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
                // Create salted password 
                $password = hash('sha512', $contact . $salt);
        
                $pdo = getConnection();
                $sql = "INSERT INTO `person` VALUES ( NULL, :auth, :name, :address, :contact, :password, :salt, :neighborhood, :updated )";
                $params = array(
                    "auth" => 3,
                    "name" => $name,
                    "address" => '',
                    "contact" => $contact,
                    "password" => $password,
                    "salt" => $salt,
                    "neighborhood" => $neighborhood,
                    "updated" => date("Y-m-d H:i:s"),
                );
                if ($name == '' || $neighborhood == '') {
                    $params = array(
                        "auth" => 4,
                        "name" => $name,
                        "address" => '',
                        "contact" => $contact,
                        "password" => $password,
                        "salt" => $salt,
                        "neighborhood" => $neighborhood,
                        "updated" => date("Y-m-d H:i:s"),
                    );
                }
                try {
                    $stmt = $pdo->prepare($sql);
                    if ($stmt) {
                        $stmt->execute($params);
                        if (login($contact, $contact) == true) {
                            $params = array(
                                "result" => "true",
                                "id" => $_SESSION['user_id'],
                                "contact" => $_SESSION['contact'],
                                "auth" => $_SESSION['user_auth'],
                                "code" => 400,
                            );
                            echo json_encode($params);
                        } else {
                            $params = array(
                                "code" => 805
                            );
                            echo json_encode($params);
                        }
                    }
                } catch(PDOException $e) {
                    $params = array(
                        "code" => 404
                    );
                    echo json_encode($params);
                }
            }
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    } else {
        // The correct POST variables were not sent to this page.
        $params = array(
            "code" => 404
        );
        echo json_encode($params);
    }
?>