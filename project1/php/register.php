<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');
session_start();
include 'db.php';

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    echo "Будь ласка, заповніть усі поля.";
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql_check = $conn->prepare("SELECT * FROM users WHERE email = ?");
$sql_check->bind_param("s", $email);
$sql_check->execute();
$result = $sql_check->get_result();

if ($result->num_rows > 0) {
    echo "Користувач з таким email вже існує!";
    $sql_check->close();
    $conn->close();
    exit;
}

$sql_insert = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$sql_insert->bind_param("sss", $name, $email, $hashed_password);

if ($sql_insert->execute()) {
    echo "Реєстрація успішна! Тепер можете увійти.";
} else {
    echo "Помилка: " . $conn->error;
}

$sql_check->close();
$sql_insert->close();
$conn->close();
?>