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
$board_id = $data['board_id'] ?? 0;

$sql = $conn->prepare("DELETE FROM boards WHERE id = ? AND user_id = ?");
$sql->bind_param("ii", $board_id, $user_id);

if ($sql->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$sql->close();
$conn->close();
?>