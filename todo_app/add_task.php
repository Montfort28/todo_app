<?php
session_start();
include 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Check if required fields are provided
if (empty($_POST['task_name'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Task name is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$task_name = trim($_POST['task_name']);
$task_description = isset($_POST['task_description']) ? trim($_POST['task_description']) : '';
$due_date = !empty($_POST['due_date']) ? $_POST['due_date'] : NULL;
$priority = isset($_POST['priority']) ? $_POST['priority'] : 'medium';

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO tasks (user_id, task_name, task_description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, 'pending')");
$stmt->bind_param("issss", $user_id, $task_name, $task_description, $due_date, $priority);

// Execute query
if ($stmt->execute()) {
    $task_id = $conn->insert_id;
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Task added successfully',
        'task_id' => $task_id,
        'task_name' => $task_name,
        'task_description' => $task_description,
        'due_date' => $due_date,
        'priority' => $priority,
        'status' => 'pending'
    ]);
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Failed to add task: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>