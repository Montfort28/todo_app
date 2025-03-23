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

// Verify the task belongs to the current user
$stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $task_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Task not found or access denied']);
    exit;
}

// Build the update query dynamically based on provided fields
$updates = array();
$params = array();
$types = "";

if (isset($_POST['task_name']) && !empty($_POST['task_name'])) {
    $updates[] = "task_name = ?";
    $params[] = trim($_POST['task_name']);
    $types .= "s";
}

if (isset($_POST['task_description'])) {
    $updates[] = "task_description = ?";
    $params[] = trim($_POST['task_description']);
    $types .= "s";
}

if (isset($_POST['due_date'])) {
    if (empty($_POST['due_date'])) {
        $updates[] = "due_date = NULL";
    } else {
        $updates[] = "due_date = ?";
        $params[] = $_POST['due_date'];
        $types .= "s";
    }
}

if (isset($_POST['priority'])) {
    $updates[] = "priority = ?";
    $params[] = $_POST['priority'];
    $types .= "s";
}

if (isset($_POST['status'])) {
    $updates[] = "status = ?";
    $params[] = $_POST['status'];
    $types .= "s";
}

// If no fields to update
if (empty($updates)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No fields to update']);
    exit;
}

// Add task_id and user_id to params
$params[] = $task_id;
$params[] = $user_id;
$types .= "ii";

// Build and execute the update query
$query = "UPDATE tasks SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    // Fetch the updated task to return
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $task_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $task = $result->fetch_assoc();
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Task updated successfully', 'task' => $task]);
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Failed to update task: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>