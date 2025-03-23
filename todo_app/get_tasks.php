<?php
session_start();
include 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Optional filter parameters
$status = isset($_GET['status']) ? $_GET['status'] : null;
$priority = isset($_GET['priority']) ? $_GET['priority'] : null;

// Base query
$query = "SELECT * FROM tasks WHERE user_id = ?";
$params = array($user_id);
$types = "i";

// Add filters if provided
if ($status) {
    $query .= " AND status = ?";
    $params[] = $status;
    $types .= "s";
}

if ($priority) {
    $query .= " AND priority = ?";
    $params[] = $priority;
    $types .= "s";
}

// Add order by
$query .= " ORDER BY 
    CASE 
        WHEN status = 'pending' THEN 1
        WHEN status = 'in_progress' THEN 2
        WHEN status = 'completed' THEN 3
    END,
    CASE 
        WHEN priority = 'high' THEN 1
        WHEN priority = 'medium' THEN 2
        WHEN priority = 'low' THEN 3
    END,
    due_date ASC NULLS LAST";

// Prepare and execute statement
$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$tasks = array();
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'tasks' => $tasks]);

$stmt->close();
$conn->close();
?>