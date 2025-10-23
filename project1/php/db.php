<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "sql206.infinityfree.com";
$username = "if0_40235073";
$password = "065312ewQewQ";
$dbname = "if0_40235073_doify";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Помилка з'єднання: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
