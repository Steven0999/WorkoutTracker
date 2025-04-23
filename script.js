function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  const tablinks = document.getElementsByClassName("tablinks");

  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

const gymExercises = {
  "Fullbody": [...],
  "Upper": [...],
  "Lower": [...],
  "Push": [...],
  "Pull": [...],
  "Squats": [...],
  "Hinge": [...]
};

const homeExercises = {
  "Fullbody": [...],
  "Upper": [...],
  "Lower": [...],
  "Push": [...],
  "Pull": [...],
  "Squats": [...],
  "Hinge": [...],
  "Core": [...]
};

const gymEquipment = ["Barbells", "Dumbbells", "Cables", "Weight Machines", "Resistance Bands", "Bodyweight", "Kettlebells"];
const homeEquipment = ["Bodyweight", "Resistance Bands"];

function populateEquipmentDropdown() {
  const location = document.getElementById("location").value;
  const equipmentDropdown = document.getElementById("equipmentDropdown");
  equipmentDropdown.innerHTML = "<option value='' disabled selected>Select Equipment</option>";

  const equipmentOptions = location === "gym" ? gymEquipment : homeEquipment;
  equipmentOptions.forEach(equipment => {
    const option = document.createElement("option");
    option.value = equipment;
    option.textContent = equipment;
    equipmentDropdown.appendChild(option);
  });

  populateExerciseDropdown();
}

function populateExerciseDropdown() {
  const location = document.getElementById("location").value;
  const focus = document.getElementById("focus").value;
  const equipment = document.getElementById("equipmentDropdown").value;
  const exerciseDropdown = document.getElementById("exerciseDropdown");

  exerciseDropdown.innerHTML = "<option value='' disabled selected>Select an Exercise</option>";

  if (!location || !focus || !equipment) return;

  const exerciseOptions = location === "gym" ? gymExercises[focus] : homeExercises[focus];
  if (!exerciseOptions) return;

  exerciseOptions.forEach(exercise => {
    const option = document.createElement("option");
    option.value = exercise;
    option.textContent = exercise;
    exerciseDropdown.appendChild(option);
  });

  updateBestWeightDisplay();
}

function updateBestWeightDisplay() {
  const equipment = document.getElementById("equipmentDropdown").value;
  const exercise = document.getElementById("exerciseDropdown").value;
  const bestWeightSpan = document.querySelector(".best-weight");

  const key = `${exercise}-${equipment}`;
  bestWeightSpan.textContent = localStorage.getItem(key) || "-";
}

function saveData() {
  const equipment = document.getElementById("equipmentDropdown").value;
  const exercise = document.getElementById("exerciseDropdown").value;
  const sets = 3;
  const reps = 10;
  const weight = document.querySelector(".exercise-weight").value;
  const focus = document.getElementById("focus").value;

  if (!equipment || !exercise || !weight) {
    alert("Please fill in all the fields.");
    return;
  }

  const key = `${exercise}-${equipment}`;
  const previousBest = localStorage.getItem(key);
  if (!previousBest || parseFloat(weight) > parseFloat(previousBest)) {
    localStorage.setItem(key, weight);
  }

  updateBestWeightDisplay();

  let tableBody;
  if (["Upper", "Push", "Pull"].includes(focus)) {
    tableBody = document.querySelector("#upperBodyTable tbody");
  } else if (["Lower", "Squats", "Hinge"].includes(focus)) {
    tableBody = document.querySelector("#lowerBodyTable tbody");
  } else {
    alert("This focus type doesn't have a destination table.");
    return;
  }

  const row = tableBody.insertRow();
  row.insertCell(0).textContent = equipment;
  row.insertCell(1).textContent = exercise;
  row.insertCell(2).textContent = sets;
  row.insertCell(3).textContent = reps;
  row.insertCell(4).textContent = weight;

  const clearCell = row.insertCell(5);
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear";
  clearButton.className = "clear-button";
  clearButton.onclick = function () {
    tableBody.removeChild(row);
  };
  clearCell.appendChild(clearButton);

  document.getElementById("equipmentDropdown").value = "";
  document.getElementById("exerciseDropdown").value = "";
  document.querySelector(".exercise-weight").value = "";
  document.querySelector(".best-weight").textContent = "-";
}

document.getElementById("defaultOpen").click();
