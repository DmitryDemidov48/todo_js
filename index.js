// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const deleteAllBtn = document.getElementById('deleteAllBtn');

const svgTick = './img/tick.svg';
const svgCross = '../img/cross.svg';


// Добавим обработчик события для кнопки "Удалить Все"
deleteAllBtn.addEventListener('click', deleteAllTasks);

// Функция для удаления всех задач
function deleteAllTasks() {
    try {
        // Очищаем массив задач
        tasks = [];

        // Сохраняем пустой список задач в хранилище браузера localStorage
        saveToLocalStorage();

        // Очищаем разметку списка задач
        tasksList.innerHTML = '';

        // Проверяем и добавляем блок "Список задач пуст"
        checkEmptyList();
    } catch (error) {
        console.error('Error deleting all tasks:', error);
    }
}

let tasks = [];

// Загрузка задач из localStorage при запуске приложения
document.addEventListener('DOMContentLoaded', () => {
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks();
        checkEmptyList();
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
    }
});

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', handleTaskAction);

function addTask(event) {
    try {
        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (!taskText) {
            alert('Введите текст задачи.');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false,
        };

        tasks.push(newTask);
        saveToLocalStorage();
        renderTask(newTask);

        taskInput.value = '';
        taskInput.focus();

        checkEmptyList();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

function handleTaskAction(event) {
    try {
        const actionButton = event.target.closest('.btn-action');

        if (!actionButton) return;

        const taskId = +actionButton.closest('.list-group-item').dataset.id;
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (actionButton.dataset.action === 'done') {
            tasks[taskIndex].done = !tasks[taskIndex].done;
            saveToLocalStorage();
            renderTasks();
        } else if (actionButton.dataset.action === 'delete') {
            tasks.splice(taskIndex, 1);
            saveToLocalStorage();
            renderTasks();
        }
    } catch (error) {
        console.error('Error handling task action:', error);
    }
}

function renderTasks() {
    try {
        tasksList.innerHTML = '';
        tasks.forEach(renderTask);
    } catch (error) {
        console.error('Error rendering tasks:', error);
    }
}

function renderTask(task) {
    try {
        const taskItem = document.createElement('li');
        taskItem.dataset.id = task.id;
        taskItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'task-item');

        const taskTitle = document.createElement('span');
        taskTitle.classList.add('task-title');

        // Добавляем класс task-title--done, если задача выполнена
        if (task.done) {
            taskTitle.classList.add('task-title--done');
        }

        taskTitle.textContent = task.text;

        const taskButtons = document.createElement('div');
        taskButtons.classList.add('task-item__buttons');

        const doneButton = createActionButton('done');
        const deleteButton = createActionButton('delete');

        taskButtons.append(doneButton, deleteButton);
        taskItem.append(taskTitle, taskButtons);
        tasksList.appendChild(taskItem);
    } catch (error) {
        console.error('Error rendering task:', error);
    }
}

function createActionButton(action) {
    try {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.action = action;
        button.classList.add('btn-action');

        const icon = document.createElement('img');
        icon.src = action === 'done' ? svgTick : svgCross;
        icon.alt = action === 'done' ? 'Done' : 'Delete';
        icon.width = 18;
        icon.height = 18;

        button.appendChild(icon);
        return button;
    } catch (error) {
        console.error('Error creating action button:', error);
    }
}

function checkEmptyList() {
    try {
        const emptyListEl = document.getElementById('emptyList');

        if (tasks.length === 0) {
            if (!emptyListEl) {
                const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <div class="empty-list__title">Список задач пуст</div>
          </li>`;
                tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
            }
        } else {
            if (emptyListEl) {
                emptyListEl.remove();
            }
        }
    } catch (error) {
        console.error('Error checking empty list:', error);
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}
