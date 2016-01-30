<?php
	  include_once 'functions.php';
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = login_check();
    if ($check) {
        $params = array(
            "result" => "true",
            "id" => $_SESSION['user_id'],
            "contact" => $_SESSION['contact'],
            "auth" => $_SESSION['user_auth'],
        );
        echo json_encode($params);
    } else {
        $params = array(
            "result" => "false",
            "code" => 901,
        );
        echo json_encode($params);
    }
?>