<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');
session_start();
include 'db.php';


$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo "Будь ласка, введіть email і пароль.";
    exit;
}

$sql = $conn->prepare("SELECT * FROM users WHERE email = ?");
$sql->bind_param("s", $email);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows == 0) {
    echo "Користувача з таким email не знайдено!";
    $sql->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    echo "Вхід успішний! Вітаємо, " . htmlspecialchars($user['name']) . "!";
} else {
    echo "Невірний пароль!";
}

$sql->close();
$conn->close();
?>