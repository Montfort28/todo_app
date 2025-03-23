<?php
session_start();
include 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Check if task ID is provided
if (!isset($_POST['task_id']) || empty($_POST['task_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Task ID is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$task_id = $_POST['task_id'];

// Verify the task belongs to the current user and delete it
$stmt = $conn->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $task_id, $user_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Task deleted successfully']);
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Task not found or access denied']);
}

$stmt->close();
$conn->close();
?>