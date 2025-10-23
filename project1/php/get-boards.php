<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = $conn->prepare("SELECT id, name, created_at FROM boards WHERE user_id = ? ORDER BY created_at DESC");
$sql->bind_param("i", $user_id);
$sql->execute();
$result = $sql->get_result();

$boards = [];
while ($row = $result->fetch_assoc()) {
    $boards[] = $row;
}

echo json_encode(['success' => true, 'boards' => $boards]);

$sql->close();
$conn->close();
?>