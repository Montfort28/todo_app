document.addEventListener('DOMContentLoaded', function() {
    // Sample tasks data (will be replaced with AJAX calls to the server)
    // This is just for demonstration purposes
    let tasks = [
        {
            id: 1,
            title: 'Complete security audit',
            description: 'Review all application endpoints for vulnerabilities.',
            created_at: '2025-03-20',
            due_date: '2025-03-25',
            priority: 'High',
            is_completed: false
        },
        {
            id: 2,
            title: 'Update passwords',
            description: 'Change all system passwords and implement password rotation policy.',
            created_at: '2025-03-21',
            due_date: '2025-03-24',
            priority: 'Medium',
            is_completed: false
        },
        {
            id: 3,
            title: 'Backup database',
            description: 'Create a full backup of all production databases.',
            created_at: '2025-03-19',
            due_date: '2025-03-22',
            priority: 'Low',
            is_completed: true
        }
    ];
    
    // DOM elements
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const taskDetailsModal = document.getElementById('task-details-modal');
    const addTaskForm = document.getElementById('add-task-form');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    
    // Close modals when clicking the X
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            addTaskModal.style.display = 'none';
            taskDetailsModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addTaskModal) {
            addTaskModal.style.display = 'none';
        }
        if (event.target === taskDetailsModal) {
            taskDetailsModal.style.display = 'none';
        }
    });
    
    // Open add task modal
    addTaskBtn.addEventListener('click', function() {
        addTaskModal.style.display = 'flex';
    });
    
    // Load tasks initially
    loadTasks();
    updateTaskStats();
    
    // Handle task filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tasks
            const filter = this.getAttribute('data-filter');
            loadTasks(filter);
        });
    });
    
    // Handle task sorting
    sortSelect.addEventListener('change', function() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        loadTasks(activeFilter);
    });
    
    // Add new task
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;
        
        // In a real application, this would be an AJAX call to add_task.php
        // For demo purposes, we'll just add to our local array
        const newTask = {
            id: tasks.length + 1,
            title: title,
            description: description,
            created_at: new Date().toISOString().split('T')[0],
            due_date: dueDate,
            priority: priority,
            is_completed: false
        };
        
        tasks.push(newTask);
        
        // Reset form
        addTaskForm.reset();
        
        // Close modal
        addTaskModal.style.display = 'none';
        
        // Reload tasks
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        loadTasks(activeFilter);
        updateTaskStats();
        
        // Show success notification (could be implemented)
        alert('Task added successfully!');
    });
    
    // Function to load tasks
    function loadTasks(filter = 'all') {
        // Clear task list
        taskList.innerHTML = '';
        
        // Sort tasks
        const sortValue = sortSelect.value;
        sortTasks(sortValue);
        
        // Filter tasks
        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.is_completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.is_completed);
        }
        
        // If no tasks, show message
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<div class="no-tasks">No tasks found</div>';
            return;
        }
        
        // Add tasks to DOM
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }
    
    // Function to create task element
    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-card ${task.priority.toLowerCase()}-priority ${task.is_completed ? 'completed' : ''} fade-in`;
        taskDiv.dataset.id = task.id;
        
        // Format dates
        const createdDate = new Date(task.created_at).toLocaleDateString();
        let dueDateDisplay = 'No due date';
        if (task.due_date) {
            dueDateDisplay = new Date(task.due_date).toLocaleDateString();
        }
        
        taskDiv.innerHTML = `
            <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
            <h3 class="task-title">${task.title}</h3>
            <div class="task-date">
                <i class="fas fa-calendar-alt"></i> Due: ${dueDateDisplay}
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-actions">
                ${!task.is_completed ? 
                `<button class="btn-success complete-task" title="Mark as Complete">
                    <i class="fas fa-check"></i>
                </button>` : 
                `<button class="btn-secondary incomplete-task" title="Mark as Incomplete">
                    <i class="fas fa-undo"></i>
                </button>`}
                <button class="btn-secondary view-task" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
        
        // Add event listener to open task details
        taskDiv.querySelector('.view-task').addEventListener('click', function(e) {
            e.stopPropagation();
            openTaskDetails(task);
        });
        
        // Add event listener for the whole card
        taskDiv.addEventListener('click', function() {
            openTaskDetails(task);
        });
        
        // Add event listener to complete task
        const completeBtn = taskDiv.querySelector('.complete-task');
        if (completeBtn) {
            completeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                completeTask(task.id);
            });
        }
        
        // Add event listener to mark task as incomplete
        const incompleteBtn = taskDiv.querySelector('.incomplete-task');
        if (incompleteBtn) {
            incompleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                incompleteTask(task.id);
            });
        }
        
        return taskDiv;
    }
    
    // Function to open task details
    function openTaskDetails(task) {
        // Set details
        document.getElementById('detail-title').textContent = task.title;
        document.getElementById('detail-created').textContent = `Created: ${new Date(task.created_at).toLocaleDateString()}`;
        
        let dueDateText = 'No due date';
        if (task.due_date) {
            dueDateText = `Due: ${new Date(task.due_date).toLocaleDateString()}`;
        }
        document.getElementById('detail-due-date').textContent = dueDateText;
        
        document.getElementById('detail-priority').textContent = `Priority: ${task.priority}`;
        document.getElementById('detail-priority').className = task.priority.toLowerCase();
        
        document.getElementById('detail-description').textContent = task.description || 'No description provided.';
        
        // Set up action buttons
        const completeBtn = document.getElementById('complete-task-btn');
        if (task.is_completed) {
            completeBtn.innerHTML = '<i class="fas fa-undo"></i> Mark Incomplete';
            completeBtn.className = 'btn-secondary';
        } else {
            completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mark Complete';
            completeBtn.className = 'btn-success';
        }
        
        // Set event listeners for action buttons
        completeBtn.onclick = function() {
            if (task.is_completed) {
                incompleteTask(task.id);
            } else {
                completeTask(task.id);
            }
            taskDetailsModal.style.display = 'none';
        };
        
        document.getElementById('delete-task-btn').onclick = function() {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(task.id);
                taskDetailsModal.style.display = 'none';
            }
        };
        
        document.getElementById('edit-task-btn').onclick = function() {
            // In a real application, this would open an edit form
            alert('Edit functionality would be implemented here.');
        };
        
        // Show modal
        taskDetailsModal.style.display = 'flex';
    }
    
    // Function to mark task as complete
    function completeTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.is_completed = true;
            
            // In a real application, send AJAX request to update task
            
            // Reload tasks
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            loadTasks(activeFilter);
            updateTaskStats();
        }
    }
    
    // Function to mark task as incomplete
    function incompleteTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.is_completed = false;
            
            // In a real application, send AJAX request to update task
            
            // Reload tasks
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            loadTasks(activeFilter);
            updateTaskStats();
        }
    }
    
    // Function to delete task
    function deleteTask(taskId) {
        // Filter out the task
        tasks = tasks.filter(task => task.id !== taskId);
        
        // In a real application, send AJAX request to delete task
        
        // Reload tasks
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        loadTasks(activeFilter);
        updateTaskStats();
    }
    
    // Function to sort tasks
    function sortTasks(sortBy) {
        switch (sortBy) {
            case 'date-desc':
                tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'date-asc':
                tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'priority':
                const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
                tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'name':
                tasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    // Function to update task statistics
    function updateTaskStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.is_completed).length;
        const pending = total - completed;
        
        totalTasksElement.textContent = total;
        completedTasksElement.textContent = completed;
        pendingTasksElement.textContent = pending;
    }
});