function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  const tablinks = document.getElementsByClassName("tablinks");

  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("defaultOpen").click();
});

const gymExercises = {
  Fullbody: ["Bench Press", "Deadlifts", "Squats"],
  Upper: ["Bench Press", "Military Press", "Bicep Curls"],
  Lower: ["Squats", "Deadlifts", "Hip Thrusts"],
  Push: ["Bench Press", "Military Press"],
  Pull: ["Bicep Curls", "Pull-ups"],
  Squats: ["Squats", "Lunges"],
  Hinge: ["Deadlifts", "Romanian Deadlifts"],
  Core: []
};

const homeExercises = {
  Fullbody: ["Push-ups", "Squats", "Lunges"],
  Upper: ["Push-ups", "Dips"],
  Lower: ["Squats", "Lunges"],
  Push: ["Push-ups"],
  Pull: ["Pull-ups"],
  Squats: ["Squats"],
  Hinge: ["Hamstring Walkbacks"],
  Core: ["Crunches", "Heel Taps"]
};

const gymEquipment = ["Barbells", "Dumbbells", "Bodyweight"];
const homeEquipment = ["Bodyweight", "Resistance Bands"];

const bestWeights = {};

function populateEquipmentDropdown() {
  const location = document.getElementById("location").value;
  const equipmentDropdown = document.getElementById("equipmentDropdown");
  equipmentDropdown.innerHTML = `<option value="" disabled selected>Select Equipment</option>`;
  const options = location === "gym" ? gymEquipment : homeEquipment;
  options.forEach(eq => {
    const option = document.createElement("option");
    option.value = eq;
    option.textContent = eq;
    equipmentDropdown.appendChild(option);
  });
  populateExerciseDropdown();
}

function populateExerciseDropdown() {
  const location = document.getElementById("location").value;
  const focus = document.getElementById("focus").value;
  const exerciseDropdown = document.getElementById("exerciseDropdown");

  exerciseDropdown.innerHTML = `<option value="" disabled selected>Select an Exercise</option>`;

  if (!location || !focus) return;

  const exercises = location === "gym" ? gymExercises[focus] : homeExercises[focus];
  exercises.forEach(ex => {
    const option = document.createElement("option");
    option.value = ex;
    option.textContent = ex;
    exerciseDropdown.appendChild(option);
  });

  updateBestWeightDisplay();
}

function updateBestWeightDisplay() {
  const exercise = document.getElementById("exerciseDropdown").value;
  const equipment = document.getElementById("equipmentDropdown").value;
  const key = `${exercise}-${equipment}`;
  const best = bestWeights[key] || "";
  document.querySelector(".best-weight").textContent = best;
}

function saveData() {
  const equipment = document.getElementById("equipmentDropdown").value;
  const exercise = document.getElementById("exerciseDropdown").value;
  const weight = parseFloat(document.querySelector(".exercise-weight").value);
  const focus = document.getElementById("focus").value;

  if (!equipment || !exercise || isNaN(weight)) {
    alert("Please fill in all fields.");
    return;
  }

  const sets = 3, reps = 10;
  const table = focus === "Upper" ? document.querySelector("#upperBodyTable tbody") : document.querySelector("#lowerBodyTable tbody");

  const row = table.insertRow();
  row.insertCell(0).textContent = equipment;
  row.insertCell(1).textContent = exercise;
  row.insertCell(2).textContent = sets;
  row.insertCell(3).textContent = reps;
  row.insertCell(4).textContent = weight;
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear";
  clearBtn.className = "clear-button";
  clearBtn.onclick = () => table.removeChild(row);
  row.insertCell(5).appendChild(clearBtn);

  const key = `${exercise}-${equipment}`;
  if (!bestWeights[key] || weight > bestWeights[key]) {
    bestWeights[key] = weight;
  }

  document.getElementById("equipmentDropdown").value = "";
  document.getElementById("exerciseDropdown").value = "";
  document.querySelector(".exercise-weight").value = "";
  updateBestWeightDisplay();
}
