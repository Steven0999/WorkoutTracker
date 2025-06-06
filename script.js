// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Tab switching
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');
}

document.getElementById("defaultOpen").click();

const exercises = {
  gym: ['Barbell', 'Dumbbell', 'Cable'],
  home: ['Bodyweight', 'Resistance Band']
};

const exerciseOptions = {
  Barbell: ['Squat', 'Bench Press', 'Deadlift'],
  Dumbbell: ['Curl', 'Press'],
  Cable: ['Lat Pulldown', 'Triceps Pushdown'],
  Bodyweight: ['Push-up', 'Pull-up'],
  'Resistance Band': ['Band Squat', 'Band Row']
};

function populateEquipmentDropdown() {
  const location = document.getElementById('location').value;
  const equipmentDropdown = document.getElementById('equipmentDropdown');
  equipmentDropdown.innerHTML = '';
  if (exercises[location]) {
    exercises[location].forEach(equipment => {
      const option = document.createElement('option');
      option.value = equipment;
      option.text = equipment;
      equipmentDropdown.appendChild(option);
    });
    populateExerciseDropdown();
  }
}

function populateExerciseDropdown() {
  const equipment = document.getElementById('equipmentDropdown').value;
  const exerciseDropdown = document.getElementById('exerciseDropdown');
  exerciseDropdown.innerHTML = '';
  if (exerciseOptions[equipment]) {
    exerciseOptions[equipment].forEach(exercise => {
      const option = document.createElement('option');
      option.value = exercise;
      option.text = exercise;
      exerciseDropdown.appendChild(option);
    });
  }
}

function addCustomExercise() {
  const custom = document.getElementById('customExerciseInput').value.trim();
  if (custom) {
    const option = document.createElement('option');
    option.value = custom;
    option.text = custom;
    document.getElementById('exerciseDropdown').appendChild(option);
    document.getElementById('customExerciseInput').value = '';
  }
}

function saveData() {
  const focus = document.getElementById('focus').value;
  const equipment = document.getElementById('equipmentDropdown').value;
  const exercise = document.getElementById('exerciseDropdown').value;
  const weight = document.querySelector('.exercise-weight').value;
  const tableId = focus === 'Upper' ? 'upperBodyTable' : 'lowerBodyTable';
  const table = document.getElementById(tableId).querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${equipment}</td>
    <td>${exercise}</td>
    <td><input type="number" placeholder="Sets"></td>
    <td><input type="number" placeholder="Reps"></td>
    <td>${weight} kg</td>
    <td><button onclick="this.closest('tr').remove()">Clear</button></td>
  `;
  table.appendChild(row);
  document.querySelector('.exercise-weight').value = '';
  logExerciseWeight(exercise, weight);
}

function startRestTimer() {
  const input = document.getElementById('restInput').value;
  const duration = parseInt(input);
  if (!isNaN(duration) && duration > 0) {
    let remaining = duration;
    const timerDisplay = document.getElementById('restTimer');
    const interval = setInterval(() => {
      timerDisplay.textContent = `Rest: ${remaining}s`;
      remaining--;
      if (remaining < 0) {
        clearInterval(interval);
        timerDisplay.textContent = 'Rest: Done!';
      }
    }, 1000);
  } else {
    alert("Please enter a valid number.");
  }
}

let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
const weightList = document.getElementById('weightList');
const weightChartCtx = document.getElementById('weightChart').getContext('2d');
let currentExercise = '';

function renderWeightEntries() {
  weightList.innerHTML = '';
  weightData.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="flex-space-between">
        <div>
          <strong>${entry.weight} kg</strong> - ${entry.date} ${entry.time} (${entry.exercise})
        </div>
        <div>
          <button onclick="editEntry(${index})">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </div>
      </div>
    `;
    weightList.appendChild(card);
  });
  updateChart(currentExercise);
}

function addWeightEntry() {
  const weight = document.getElementById('weightInput').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  const exercise = document.getElementById('exerciseRecordInput').value.trim();
  if (weight && date && time && exercise) {
    weightData.push({ weight, date, time, exercise });
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
    document.getElementById('weightInput').value = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';
    document.getElementById('exerciseRecordInput').value = '';
  } else {
    alert('Please fill in all fields');
  }
}

function logExerciseWeight(exercise, weight) {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toTimeString().split(' ')[0].slice(0,5);
  weightData.push({ weight, date, time, exercise });
  localStorage.setItem('weightData', JSON.stringify(weightData));
  renderWeightEntries();
}

function editEntry(index) {
  const entry = weightData[index];
  const newWeight = prompt('Edit weight (kg):', entry.weight);
  const newDate = prompt('Edit date (YYYY-MM-DD):', entry.date);
  const newTime = prompt('Edit time (HH:MM):', entry.time);
  const newExercise = prompt('Edit exercise:', entry.exercise);
  if (newWeight && newDate && newTime && newExercise) {
    weightData[index] = { weight: newWeight, date: newDate, time: newTime, exercise: newExercise };
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
  }
}

function deleteEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    weightData.splice(index, 1);
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
  }
}

function updateChart(exerciseFilter = '') {
  if (window.weightChartInstance) {
    window.weightChartInstance.destroy();
  }
  const filteredData = weightData.filter(e => e.exercise.toLowerCase().includes(exerciseFilter.toLowerCase()));
  const labels = filteredData.map(e => `${e.date} ${e.time}`);
  const data = filteredData.map(e => parseFloat(e.weight));
  window.weightChartInstance = new Chart(weightChartCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Weight Progress (${exerciseFilter || 'All'})`,
        data,
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function filterGraph() {
  const input = document.getElementById('searchExerciseInput').value;
  currentExercise = input;
  updateChart(input);
}

renderWeightEntries();
