// TodoManagement.API/wwwroot/js/site.js

// API base URL
const apiBaseUrl = 'https://localhost:44368/api/todos';

// DOM Elements
const todoList = document.getElementById('todoList');
const noTodosMessage = document.getElementById('noTodosMessage');
const todoForm = document.getElementById('todoForm');
const modalTitle = document.getElementById('modalTitle');
const todoModal = new bootstrap.Modal(document.getElementById('todoModal'));
const statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const toast = new bootstrap.Toast(document.getElementById('toast'));

// Current filter state
let currentFilter = 'all';
let todos = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.btn-group button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-status');
            loadTodos();
        });
    });
    
    // Save todo button
    document.getElementById('saveTodoBtn').addEventListener('click', saveTodo);
    
    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Update status button
    document.getElementById('updateStatusBtn').addEventListener('click', updateStatus);
});

// API Functions
async function loadTodos() {
    showLoader();
    try {
        const url = currentFilter === 'all' 
            ? apiBaseUrl 
            : `${apiBaseUrl}?status=${currentFilter}`;
            
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to load todos');
        }
        
        todos = await response.json();
        renderTodos();
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error loading todos:', error);
    } finally {
        hideLoader();
    }
}

async function createTodo(todoData) {
    showLoader();
    try {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create todo');
        }
        
        const newTodo = await response.json();
        showToast('Success', 'Todo created successfully', 'success');
        loadTodos();
        return newTodo;
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error creating todo:', error);
        throw error;
    } finally {
        hideLoader();
    }
}

async function updateTodo(id, todoData) {
    showLoader();
    try {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update todo');
        }
        
        const updatedTodo = await response.json();
        showToast('Success', 'Todo updated successfully', 'success');
        loadTodos();
        return updatedTodo;
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error updating todo:', error);
        throw error;
    } finally {
        hideLoader();
    }
}

async function updateTodoStatus(id, status) {
    showLoader();
    try {
        const response = await fetch(`${apiBaseUrl}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update todo status');
        }
        
        const updatedTodo = await response.json();
        showToast('Success', 'Status updated successfully', 'success');
        loadTodos();
        return updatedTodo;
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error updating todo status:', error);
        throw error;
    } finally {
        hideLoader();
    }
}

async function completeTodo(id) {
    showLoader();
    try {
        const response = await fetch(`${apiBaseUrl}/${id}/complete`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Failed to complete todo');
        }
        
        const completedTodo = await response.json();
        showToast('Success', 'Todo marked as complete', 'success');
        loadTodos();
        return completedTodo;
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error completing todo:', error);
        throw error;
    } finally {
        hideLoader();
    }
}

async function deleteTodo(id) {
    showLoader();
    try {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        
        showToast('Success', 'Todo deleted successfully', 'success');
        loadTodos();
        return true;
    } catch (error) {
        showToast('Error', error.message, 'danger');
        console.error('Error deleting todo:', error);
        throw error;
    } finally {
        hideLoader();
    }
}

// UI Functions
function renderTodos() {
    // Clear previous todos
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.appendChild(noTodosMessage);
        return;
    }
    
    // Sort todos by status (Pending first, then InProgress, then Completed)
    // Then by priority (High, Medium, Low)
    // Then by due date (most imminent first)
    todos.sort((a, b) => {
        // First by status
        const statusOrder = { 'Pending': 0, 'InProgress': 1, 'Completed': 2 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        
        // Then by priority
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by due date
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.dueDate) {
            return -1;
        } else if (b.dueDate) {
            return 1;
        }
        
        // Finally by creation date
        return new Date(a.createdDate) - new Date(b.createdDate);
    });
    
    todos.forEach(todo => {
        const item = createTodoItem(todo);
        todoList.appendChild(item);
    });
}

function createTodoItem(todo) {
    const item = document.createElement('div');
    item.className = `list-group-item todo-item ${todo.status === 'Completed' ? 'completed' : ''}`;
    item.innerHTML = `
        <div class="row align-items-center">
            <div class="col-5">
                <h5 class="mb-1">${escapeHtml(todo.title)}</h5>
                <p class="mb-1 text-muted small">${todo.description ? escapeHtml(todo.description) : ''}</p>
                ${todo.dueDate ? `<div class="due-date ${isOverdue(todo) ? 'overdue' : ''}">
                    <i class="bi bi-calendar"></i> Due: ${formatDate(todo.dueDate)}
                </div>` : ''}
            </div>
            <div class="col-2">
                <span class="badge priority-${todo.priority} priority-badge">${todo.priority}</span>
            </div>
            <div class="col-2">
                <span class="badge status-${todo.status} status-badge">${formatStatus(todo.status)}</span>
            </div>
            <div class="col-3">
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-secondary edit-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info status-btn" title="Change Status">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                    ${todo.status !== 'Completed' ? `
                        <button type="button" class="btn btn-outline-success complete-btn" title="Mark Complete">
                            <i class="bi bi-check-lg"></i>
                        </button>
                    ` : ''}
                    <button type="button" class="btn btn-outline-danger delete-btn" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    item.querySelector('.edit-btn').addEventListener('click', () => openEditModal(todo));
    item.querySelector('.status-btn').addEventListener('click', () => openStatusModal(todo));
    if (todo.status !== 'Completed') {
        item.querySelector('.complete-btn').addEventListener('click', () => {
            completeTodo(todo.id);
        });
    }
    item.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(todo));
    
    return item;
}
function convertPriorityTextToValue(priorityText) {
    switch(priorityText.toLowerCase()) {
      case 'low':
        return 0;
      case 'medium':
        return 1;
      case 'high':
        return 2;
      default:
        return 1; // Default to Medium/1 if text doesn't match
    }
  }
  function convertStatusTextToValue(statusText) {
    switch(statusText.toLowerCase()) {
        case "pending":
            return 0;
          case "inprogress":
            return 1;
          case "completed":
            return 2;
          default:
            return 0;  // Default to Pending/0 if text doesn't match
    }
  }
function openCreateModal() {
    todoForm.reset();
    document.getElementById('todoId').value = '';
    modalTitle.textContent = 'Create Todo';
    todoModal.show();
}

function openEditModal(todo) {
    todoForm.reset();
    document.getElementById('todoId').value = todo.id;
    document.getElementById('title').value = todo.title;
    document.getElementById('description').value = todo.description || '';
    document.getElementById('priority').value = convertPriorityTextToValue(todo.priority);
    document.getElementById('dueDate').value = todo.dueDate ? formatDateForInput(todo.dueDate) : '';
    
    modalTitle.textContent = 'Edit Todo';
    todoModal.show();
}

function openStatusModal(todo) {
    document.getElementById('statusTodoTitle').textContent = todo.title;
    document.getElementById('statusSelect').value = convertStatusTextToValue(todo.status);
    document.getElementById('updateStatusBtn').setAttribute('data-id', todo.id);
    statusModal.show();
}

function openDeleteModal(todo) {
    document.getElementById('deleteTodoTitle').textContent = todo.title;
    document.getElementById('confirmDeleteBtn').setAttribute('data-id', todo.id);
    deleteModal.show();
}

async function saveTodo() {
    if (!validateForm()) {
        return;
    }
    
    const todoId = document.getElementById('todoId').value;
    const todoData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: parseInt(document.getElementById('priority').value),
        dueDate: document.getElementById('dueDate').value || null
    };
    
    try {
        if (todoId) {
            // Update existing todo
            await updateTodo(todoId, todoData);
        } else {
            // Create new todo
            await createTodo(todoData);
        }
        todoModal.hide();
    } catch (error) {
        // Error is already handled in the API functions
    }
}

async function updateStatus() {
    const todoId = document.getElementById('updateStatusBtn').getAttribute('data-id');
    const status = parseInt(document.getElementById('statusSelect').value);
    
    try {
        await updateTodoStatus(todoId, status);
        statusModal.hide();
    } catch (error) {
        // Error is already handled in the API functions
    }
}

async function confirmDelete() {
    const todoId = document.getElementById('confirmDeleteBtn').getAttribute('data-id');
    
    try {
        await deleteTodo(todoId);
        deleteModal.hide();
    } catch (error) {
        // Error is already handled in the API functions
    }
}

function validateForm() {
    const title = document.getElementById('title');
    let isValid = true;
    
    if (!title.value.trim()) {
        title.classList.add('is-invalid');
        isValid = false;
    } else {
        title.classList.remove('is-invalid');
    }
    
    return isValid;
}

// Utility Functions
function formatStatus(status) {
    switch (status) {
        case 'InProgress': return 'In Progress';
        default: return status;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function isOverdue(todo) {
    if (!todo.dueDate || todo.status === 'Completed') return false;
    return new Date(todo.dueDate) < new Date();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(title, message, type) {
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Add color classes
    const toastEl = document.getElementById('toast');
    toastEl.className = 'toast';
    toastEl.classList.add(`text-bg-${type}`);
    
    toast.show();
}

function showLoader() {
    // Create loader if it doesn't exist
    let spinner = document.querySelector('.spinner-overlay');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'spinner-overlay';
        spinner.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
}

function hideLoader() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Add a button for creating new todos in the navbar
document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.querySelector('[data-bs-target="#todoModal"]');
    createBtn.addEventListener('click', openCreateModal);
});
