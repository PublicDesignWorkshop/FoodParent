<?php
	  include_once 'functions.php';
    sec_session_start(); // Our custom secure way of starting a PHP session.
    if (isset($_POST['contact'], $_POST['p'])) {
        $contact = $_POST['contact'];
        $password = $_POST['p']; // The hashed password.
        
        if (login($contact, $password) == true) {
            $params = array(
                "result" => "true",
            );
        echo json_encode($params);
        } else {
            $params = array(
                "result" => "false",
            );
            echo json_encode($params);
        }
    } else {
        // The correct POST variables were not sent to this page.
        $params = array(
            "result" => "false",
        );
    }
?>