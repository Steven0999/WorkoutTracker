let weights = JSON.parse(localStorage.getItem('weights')) || [];
let editIndex = null;

const ctx = document.getElementById('weightChart').getContext('2d');
let weightChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Weight (kg)',
      data: [],
      borderColor: 'blue',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } }
  }
});

function switchTab(tab) {
  document.getElementById('trackerTab').style.display = tab === 'tracker' ? 'block' : 'none';
  document.getElementById('graphTab').style.display = tab === 'graph' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-btn')[tab === 'tracker' ? 0 : 1].classList.add('active');
  if (tab === 'graph') updateChart();
}

function addWeight() {
  const weight = parseFloat(document.getElementById('weightInput').value);
  let date = document.getElementById('dateInput').value;
  let time = document.getElementById('timeInput').value;

  if (!weight) return;

  const now = new Date();
  if (!date) date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  if (!time) time = now.toTimeString().split(" ")[0].slice(0, 5); // hh:mm

  const entry = { weight, date, time };

  if (editIndex !== null) {
    weights[editIndex] = entry;
    editIndex = null;
    document.getElementById('addBtn').innerText = 'Add Weight';
  } else {
    weights.push(entry);
  }

  saveData();
  clearInputs();
  renderEntries();
}

function deleteWeight(index) {
  weights.splice(index, 1);
  saveData();
  renderEntries();
}

function editWeight(index) {
  const entry = weights[index];
  document.getElementById('weightInput').value = entry.weight;
  document.getElementById('dateInput').value = entry.date;
  document.getElementById('timeInput').value = entry.time;
  editIndex = index;
  document.getElementById('addBtn').innerText = 'Update Weight';
}

function renderEntries() {
  const entriesDiv = document.getElementById('entries');
  entriesDiv.innerHTML = '';
  weights.forEach((entry, index) => {
    entriesDiv.innerHTML += `
      <div class="card">
        <div class="flex-space-between">
          <div>
            <strong>Weight:</strong> ${entry.weight} kg<br>
            <small>${entry.date} at ${entry.time}</small>
          </div>
          <div>
            <button onclick="editWeight(${index})">Edit</button>
            <button onclick="deleteWeight(${index})">Delete</button>
          </div>
        </div>
      </div>`;
  });
}

function updateChart() {
  weightChart.data.labels = weights.map(e => `${e.date} ${e.time}`);
  weightChart.data.datasets[0].data = weights.map(e => e.weight);
  weightChart.update();
}

function saveData() {
  localStorage.setItem('weights', JSON.stringify(weights));
}

function clearInputs() {
  document.getElementById('weightInput').value = '';
  document.getElementById('dateInput').value = '';
  document.getElementById('timeInput').value = '';
}

renderEntries();
