<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureTasks | Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <div class="logo-container">
            <i class="fas fa-shield-alt"></i>
            <h1>SecureTasks</h1>
        </div>
        <div class="user-info">
            <span>Welcome, <?php echo $_SESSION['username']; ?></span>
            <a href="logout.php" class="btn-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </header>

    <main class="dashboard">
        <div class="sidebar">
            <div class="user-profile">
                <div class="avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <p class="username"><?php echo $_SESSION['username']; ?></p>
            </div>
            <nav>
                <ul>
                    <li class="active"><a href="#"><i class="fas fa-tasks"></i> Tasks</a></li>
                    <li><a href="#"><i class="fas fa-chart-line"></i> Statistics</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                </ul>
            </nav>
            <div class="task-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Tasks</span>
                    <span class="stat-value" id="total-tasks">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Completed</span>
                    <span class="stat-value" id="completed-tasks">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Pending</span>
                    <span class="stat-value" id="pending-tasks">0</span>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="task-header">
                <h2><i class="fas fa-clipboard-list"></i> My Tasks</h2>
                <button id="add-task-btn" class="btn-primary"><i class="fas fa-plus"></i> Add Task</button>
            </div>

            <div class="task-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="active">Active</button>
                <button class="filter-btn" data-filter="completed">Completed</button>
                <div class="sort-container">
                    <label for="sort-select">Sort by:</label>
                    <select id="sort-select">
                        <option value="date-desc">Date (Newest)</option>
                        <option value="date-asc">Date (Oldest)</option>
                        <option value="priority">Priority</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </div>

            <div class="task-list" id="task-list">
                <!-- Tasks will be loaded here from JavaScript -->
            </div>
        </div>
    </main>

    <!-- Add Task Modal -->
    <div id="add-task-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Add New Task</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="add-task-form" action="add_task.php" method="POST">
                <div class="form-group">
                    <label for="task-title"><i class="fas fa-heading"></i> Title</label>
                    <input type="text" id="task-title" name="task-title" required>
                </div>
                <div class="form-group">
                    <label for="task-description"><i class="fas fa-align-left"></i> Description</label>
                    <textarea id="task-description" name="task-description" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="due-date"><i class="fas fa-calendar-alt"></i> Due Date</label>
                        <input type="date" id="due-date" name="due-date">
                    </div>
                    <div class="form-group">
                        <label for="priority"><i class="fas fa-flag"></i> Priority</label>
                        <select id="priority" name="priority">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn-primary">Add Task</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Task Details Modal -->
    <div id="task-details-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> Task Details</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="task-details-content">
                <h4 id="detail-title"></h4>
                <p class="task-meta">
                    <span id="detail-created"></span> | 
                    <span id="detail-due-date"></span> | 
                    <span id="detail-priority"></span>
                </p>
                <div class="task-description" id="detail-description"></div>
                <div class="task-actions">
                    <button id="edit-task-btn" class="btn-secondary"><i class="fas fa-edit"></i> Edit</button>
                    <button id="delete-task-btn" class="btn-danger"><i class="fas fa-trash-alt"></i> Delete</button>
                    <button id="complete-task-btn" class="btn-success"><i class="fas fa-check-circle"></i> Mark Complete</button>
                </div>
            </div>
        </div>
    </div>

    <script src="todo.js"></script>
</body>
</html>