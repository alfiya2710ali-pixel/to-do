 const STORAGE_KEY = 'stack-todo-tasks';
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let currentFilter = 'all';

  const listEl = document.getElementById('task-list');
  const emptyEl = document.getElementById('empty-state');
  const formEl = document.getElementById('task-form');
  const inputEl = document.getElementById('task-input');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const filterBtns = document.querySelectorAll('.filter-btn');

  document.getElementById('today-date').textContent = new Date().toLocaleDateString(undefined, {
    weekday:'long', month:'long', day:'numeric'
  });

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render(){
    const filtered = tasks.filter(t => {
      if(currentFilter === 'active') return !t.done;
      if(currentFilter === 'done') return t.done;
      return true;
    });

    listEl.innerHTML = '';
    emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task' + (task.done ? ' done' : '');

      const check = document.createElement('button');
      check.className = 'check' + (task.done ? ' checked' : '');
      check.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
      check.onclick = () => { task.done = !task.done; save(); render(); };

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.setAttribute('aria-label', 'Delete task');
      del.textContent = '✕';
      del.onclick = () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); };

      li.append(check, text, del);
      listEl.appendChild(li);
    });

    const doneCount = tasks.filter(t => t.done).length;
    const total = tasks.length;
    progressLabel.textContent = `${doneCount}/${total} done`;
    progressFill.style.width = total ? `${(doneCount/total)*100}%` : '0%';
  }

  formEl.addEventListener('submit', e => {
    e.preventDefault();
    const value = inputEl.value.trim();
    if(!value) return;
    tasks.push({ id: Date.now(), text: value, done: false });
    inputEl.value = '';
    save();
    render();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  render();