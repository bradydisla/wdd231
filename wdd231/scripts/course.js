const courseGrid = document.getElementById('course-cards');
const creditTotal = document.getElementById('total-credits');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderCourses(list) {
  courseGrid.innerHTML = '';

  list.forEach((course) => {
    const circle = document.createElement('div');
    circle.className = 'course-circle';
    if (course.completed) {
      circle.classList.add('completed');
    }

    circle.innerHTML = `
      <span class="code">${course.subject}${course.number}</span>
      <span class="status">${course.completed ? 'Completed' : 'In Progress'}</span>
    `;

    courseGrid.appendChild(circle);
  });

  const total = list.reduce((sum, course) => sum + course.credits, 0);
  creditTotal.textContent = total;
}

function renderProgress() {
  const completedCount = courses.filter((course) => course.completed).length;
  const percent = Math.round((completedCount / courses.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');

    const filter = button.dataset.filter;
    const filtered = filter === 'all'
      ? courses
      : courses.filter((course) => course.subject.toLowerCase() === filter);

    renderCourses(filtered);
  });
});

renderCourses(courses);
renderProgress();