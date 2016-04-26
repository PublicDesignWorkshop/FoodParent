Getting started:

* `content/picture` needs to exist and be writable by the webserver process in order for photo uploads to work
* `core/php/dbpass.php` is where the database password is stored. It does not exist in the source code repository, so you must create it. It's formatted like so:

```php
<?
class dbpass {
  public $password = "<your password here>";
}
?>
```
* `core/php/database.php` has the rest of your database credentials (login, port, host, database name)
* `core/php/foodparent.sql` has the SQL commands necessary to initialize your database and create the various tables.
