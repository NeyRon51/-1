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
$photo = $data['photo'] ?? '';

if (empty($photo)) {
    echo json_encode(['success' => false, 'message' => 'No photo provided']);
    exit;
}

$sql = $conn->prepare("UPDATE users SET profile_photo = ? WHERE id = ?");
$sql->bind_param("si", $photo, $user_id);

if ($sql->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$sql->close();
$conn->close();
?>