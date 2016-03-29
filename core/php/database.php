<?php
	  date_default_timezone_set('America/New_York');

      require_once("dbpass.php");
      # we isolate the db password to keep it out of source control.
      # dbpass.php has only a simple class definition like so:
      # class dbpass {
      #   public $password = "xxxx";
      # }
	
	  class database extends dbpass {
        public $host = "cj.db";
        public $username = "cj";
        public $port = 3306;
        public $db_name = "tree_parent";
	  }
?>
