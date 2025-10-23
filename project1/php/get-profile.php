<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = $conn->prepare("SELECT name, email, profile_photo FROM users WHERE id = ?");
$sql->bind_param("i", $user_id);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'name' => $user['name'],
        'email' => $user['email'],
        'profile_photo' => $user['profile_photo']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$sql->close();
$conn->close();
?>