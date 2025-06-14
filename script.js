(function () {
    // Grab important page elements
    const bodyElement = document.body;
    const taskForm = document.getElementById('todo-form');
    const tasksContainer = document.getElementById('task-list');
    const themeSwitchButton = document.getElementById('theme-toggle');

    // Load tasks from local storage or start empty
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load saved theme or default to 'light'
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);

    // Function to apply chosen theme styles and update UI
    function applyTheme(theme) {
      currentTheme = theme;
      if (theme === 'dark') {
        bodyElement.classList.add('dark');
        themeSwitchButton.textContent = '☀️'; // Sun icon for light mode toggle
        themeSwitchButton.setAttribute('aria-label', 'Switch to light theme');
      } else {
        bodyElement.classList.remove('dark');
        themeSwitchButton.textContent = '🌙'; // Moon icon for dark mode toggle
        themeSwitchButton.setAttribute('aria-label', 'Switch to dark theme');
      }
      localStorage.setItem('theme', currentTheme);
    }

    // Toggle theme when button clicked
    themeSwitchButton.addEventListener('click', () => {
      if (currentTheme === 'light') {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    });

    // Save tasks array to local storage for persistence
    function saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Format due date and time for display nicely
    function formatDueDate(dueDate, dueTime) {
      if (!dueDate) return '';
      // Format date as localized date string like "Sep 22, 2024"
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dueDate).toLocaleDateString(undefined, options);

      // If time is specified, format and append it
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':');
        const dateObj = new Date();
        dateObj.setHours(hours, minutes);
        const formattedTime = dateObj.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${formattedDate} ${formattedTime}`;
      }
      return formattedDate;
    }

    // Render the tasks on the page inside the list element
    function renderTasks() {
      tasksContainer.innerHTML = '';

      // Show friendly message if no tasks
      if (tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No tasks yet!';
        emptyMessage.style.opacity = '0.6';
        tasksContainer.appendChild(emptyMessage);
        return;
      }

      // Render each task with checkbox, name, due date/time, and remove button
      tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.tabIndex = 0;
        listItem.className = task.completed ? 'completed' : '';

        // Checkbox to toggle completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task as complete');
        checkbox.addEventListener('change', () => {
          tasks[index].completed = checkbox.checked;
          saveTasksToStorage();
          renderTasks();
        });
        listItem.appendChild(checkbox);

        // Task name span
        const nameSpan = document.createElement('span');
        nameSpan.textContent = task.name;
        nameSpan.className = 'task-name';
        listItem.appendChild(nameSpan);

        // If due info is available, show it next to task name
        const dueText = formatDueDate(task.dueDate, task.dueTime);
        if (dueText) {
          const dueSpan = document.createElement('span');
          dueSpan.textContent = dueText;
          dueSpan.className = 'task-due';
          listItem.appendChild(dueSpan);
        }

        // Remove button (red X)
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-task';
        removeButton.setAttribute('aria-label', 'Remove task');
        removeButton.innerHTML = '&times;';
        removeButton.addEventListener('click', () => {
          tasks.splice(index, 1);
          saveTasksToStorage();
          renderTasks();
        });
        listItem.appendChild(removeButton);

        tasksContainer.appendChild(listItem);
      });
    }

    // Handle form submission to add new task
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Get the input values, trimming extra spaces
      const taskName = taskForm.taskName.value.trim();
      const dueDate = taskForm.dueDate.value;
      const dueTime = taskForm.dueTime.value;

      // Make sure a task name is provided
      if (taskName === '') {
        alert('Please enter a task name.');
        taskForm.taskName.focus();
        return;
      }

      // Create new task object and add it to tasks array
      const newTask = {
        name: taskName,
        dueDate: dueDate || null,
        dueTime: dueTime || null,
        completed: false,
      };

      tasks.push(newTask);
      saveTasksToStorage();
      renderTasks();

      // Reset form inputs and focus task name for convenience
      taskForm.reset();
      taskForm.taskName.focus();
    });

    // Initial rendering of tasks on load
    renderTasks();

    // Footer name cycling logic
    const names = [
      "SANTOSH",
      "संतोष",    // Hindi
      "సంతోష్",    // Telugu
      "산토시",    // Korean
      "サントシュ",  // Japanese Katakana
      "सन्तोष",    // Sanskrit
    ];
    const nameElements = document.querySelectorAll('.animated-name span');
    let currentIndex = 0;

    function showName(index) {
      nameElements.forEach((el, i) => {
        el.classList.toggle('active', i === index);
      });
    }

    // Initial show first name
    showName(currentIndex);

    // Cycle every 3 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % names.length;
      showName(currentIndex);
    }, 3000);
  })();
