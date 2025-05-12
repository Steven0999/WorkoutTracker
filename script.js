// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Ensure DOM is loaded before default tab click
document.addEventListener("DOMContentLoaded", () => {
  const defaultTab = document.getElementById("defaultOpen");
  if (defaultTab) defaultTab.click();
});

// Tab switching
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

// Equipment and exercise dropdown population
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
  (exercises[location] || []).forEach(equipment => {
    const option = document.createElement('option');
    option.value = equipment;
    option.text = equipment;
    equipmentDropdown.appendChild(option);
  });
  populateExerciseDropdown();
}

function populateExerciseDropdown() {
  const equipment = document.getElementById('equipmentDropdown').value;
  const exerciseDropdown = document.getElementById('exerciseDropdown');
  exerciseDropdown.innerHTML = '';
  (exerciseOptions[equipment] || []).forEach(exercise => {
    const option = document.createElement('option');
    option.value = exercise;
    option.text = exercise;
    exerciseDropdown.appendChild(option);
  });
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

// Save workout log
function saveData() {
  const equipment = document.getElementById('equipmentDropdown').value;
  const exercise = document.getElementById('exerciseDropdown').value;
  const weight = document.querySelector('.exercise-weight').value;
  const focus = document.getElementById('focus').value;

  const tableId = focus === 'Upper' ? 'upperBodyTable' : 'lowerBodyTable';
  const table = document.getElementById(tableId)?.querySelector('tbody');
  if (!table) return;

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
}

// Rest Timer
function startRestTimer() {
  const input = prompt("Enter rest time in seconds:");
  const duration = parseInt(input);
  if (!isNaN(duration) && duration > 0) {
    let remaining = duration;
    const timerDisplay = document.getElementById('restTimer');
    if (!timerDisplay) return;
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

// Weight Tracker Logic
let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
const weightList = document.getElementById('weightList');
const weightChartCanvas = document.getElementById('weightChart');
const weightChartCtx = weightChartCanvas ? weightChartCanvas.getContext('2d') : null;

function renderWeightEntries() {
  if (!weightList) return;
  weightList.innerHTML = '';
  weightData.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="flex-space-between">
        <div>
          <strong>${entry.weight} kg</strong> - ${entry.date} ${entry.time}
        </div>
        <div>
          <button onclick="editEntry(${index})">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </div>
      </div>
    `;
    weightList.appendChild(card);
  });
  updateChart();
}

function addWeightEntry() {
  const weight = document.getElementById('weightInput').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  if (weight && date && time) {
    weightData.push({ weight, date, time });
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
    document.getElementById('weightInput').value = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';
  } else {
    alert('Please fill in all fields');
  }
}

function editEntry(index) {
  const entry = weightData[index];
  const newWeight = prompt('Edit weight (kg):', entry.weight);
  const newDate = prompt('Edit date (YYYY-MM-DD):', entry.date);
  const newTime = prompt('Edit time (HH:MM):', entry.time);
  if (newWeight && newDate && newTime) {
    weightData[index] = { weight: newWeight, date: newDate, time: newTime };
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

function updateChart() {
  if (!weightChartCtx) return;
  if (window.weightChartInstance) {
    window.weightChartInstance.destroy();
  }
  const labels = weightData.map(e => `${e.date} ${e.time}`);
  const data = weightData.map(e => parseFloat(e.weight));

  window.weightChartInstance = new Chart(weightChartCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight Progress (kg)',
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

renderWeightEntries();
