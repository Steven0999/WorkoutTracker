// Dark mode toggle function to switch between light and dark themes
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Tab switching functionality
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  // Hide all tab contents
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  const tablinks = document.getElementsByClassName('tablinks');
  // Remove the active class from all tab links
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  // Show the clicked tab's content
  document.getElementById(tabName).style.display = 'block';
  // Add the active class to the clicked tab link
  evt.currentTarget.className += ' active';
}

// Default tab click to display the first tab content
document.getElementById("defaultOpen").click();

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

// Populate the equipment dropdown based on location
function populateEquipmentDropdown() {
  const location = document.getElementById('location').value;
  const equipmentDropdown = document.getElementById('equipmentDropdown');
  equipmentDropdown.innerHTML = '';
  
  // Validate if location is selected
  if (location) {
    exercises[location].forEach(equipment => {
      const option = document.createElement('option');
      option.value = equipment;
      option.text = equipment;
      equipmentDropdown.appendChild(option);
    });
    populateExerciseDropdown();  // Update exercise dropdown
  } else {
    alert('Please select a location');
  }
}

// Populate the exercise dropdown based on selected equipment
function populateExerciseDropdown() {
  const equipment = document.getElementById('equipmentDropdown').value;
  const exerciseDropdown = document.getElementById('exerciseDropdown');
  exerciseDropdown.innerHTML = '';

  // Validate if equipment is selected
  if (equipment && exerciseOptions[equipment]) {
    exerciseOptions[equipment].forEach(exercise => {
      const option = document.createElement('option');
      option.value = exercise;
      option.text = exercise;
      exerciseDropdown.appendChild(option);
    });
  } else {
    alert('Please select a valid equipment');
  }
}

// Add a custom exercise to the exercise dropdown
function addCustomExercise() {
  const custom = document.getElementById('customExerciseInput').value.trim();
  if (custom) {
    const option = document.createElement('option');
    option.value = custom;
    option.text = custom;
    document.getElementById('exerciseDropdown').appendChild(option);
    document.getElementById('customExerciseInput').value = '';  // Clear the input field
  }
}

// Save workout log into the appropriate table
function saveData() {
  const equipment = document.getElementById('equipmentDropdown').value;
  const exercise = document.getElementById('exerciseDropdown').value;
  const weight = document.querySelector('.exercise-weight').value;
  const focus = document.getElementById('focus').value;

  // Validate all required fields
  if (!equipment || !exercise || !weight || !focus) {
    alert('Please fill in all fields');
    return;
  }

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
  document.querySelector('.exercise-weight').value = '';  // Clear weight input
}

// Rest Timer Logic
function startRestTimer() {
  const input = prompt("Enter rest time in seconds:");
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

// Weight Tracker Logic
let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
const weightList = document.getElementById('weightList');
const weightChartCtx = document.getElementById('weightChart').getContext('2d');

// Render weight entries on the page
function renderWeightEntries() {
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
  updateChart();  // Update the chart with the latest data
}

// Add a new weight entry
function addWeightEntry() {
  const weight = document.getElementById('weightInput').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  
  // Validate if all fields are filled
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

// Edit an existing weight entry
function editEntry(index) {
  const entry = weightData[index];
  const newWeight = prompt('Edit weight (kg):', entry.weight);
  const newDate = prompt('Edit date (YYYY-MM-DD):', entry.date);
  const newTime = prompt('Edit time (HH:MM):', entry.time);
  
  // Validate if edited values are valid
  if (newWeight && newDate && newTime) {
    weightData[index] = { weight: newWeight, date: newDate, time: newTime };
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
  }
}

// Delete an existing weight entry
function deleteEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    weightData.splice(index, 1);
    localStorage.setItem('weightData', JSON.stringify(weightData));
    renderWeightEntries();
  }
}

// Update weight chart with the latest data
function updateChart() {
  if (window.weightChartInstance) {
    window.weightChartInstance.destroy();  // Destroy previous chart instance if it exists
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

// Initialize weight entries and render the chart
renderWeightEntries();

// Event listener to initialize weight chart when the page loads
window.onload = function() {
  renderWeightEntries();
};
