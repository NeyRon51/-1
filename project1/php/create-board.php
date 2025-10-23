<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Board name required']);
    exit;
}

$sql = $conn->prepare("INSERT INTO boards (user_id, name) VALUES (?, ?)");
$sql->bind_param("is", $user_id, $name);

if ($sql->execute()) {
    echo json_encode(['success' => true, 'board_id' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$sql->close();
$conn->close();
?>