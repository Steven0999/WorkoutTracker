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

const gymEquipment = ["Barbells", "Dumbbells", "Cables", "Weight Machines", "Resistance Bands", "Bodyweight", "Kettlebells"];
const homeEquipment = ["Bodyweight", "Resistance Bands"];

const allExercises = {
  "Squats": {
    "gym": ["Squats", "B-Stance Squats", "Bulgarian Split Squats", "Reverse Lunges"],
    "home": ["Squats", "Reverse Lunges", "Frog Squats"]
  },
  "Hinge": {
    "gym": ["Deadlifts", "Romanian Deadlifts", "Straight Leg Deadlifts", "Trap Bar Deadlifts"],
    "home": ["Hamstring Walkbacks"]
  },
  "Push": {
    "gym": ["Bench Press", "Incline Bench Press", "Military Press", "Overhead Tricep Extensions"],
    "home": ["Push-ups", "Chest Dips", "Medicine Ball Push Ups"]
  },
  "Pull": {
    "gym": ["Back Rows", "Upper Back Row", "Bicep Curls", "Hammer Curls"],
    "home": ["Pull-ups"]
  },
  "Fullbody": {
    "gym": ["Squats", "Deadlifts", "Bench Press", "Military Press"],
    "home": ["Push-ups", "Pull-ups", "Squats"]
  },
  "Upper": {
    "gym": ["Bench Press", "Incline Bench Press", "Military Press", "Back Rows", "Bicep Curls"],
    "home": ["Push-ups", "Pull-ups", "Dips"]
  },
  "Lower": {
    "gym": ["Squats", "Deadlifts", "Bulgarian Split Squats"],
    "home": ["Squats", "Lunges", "Hamstring Walkbacks"]
  }
};

const exerciseEquipmentMap = {
  "Squats": ["Barbells", "Dumbbells", "Bodyweight", "Resistance Bands"],
  "B-Stance Squats": ["Dumbbells", "Resistance Bands"],
  "Bulgarian Split Squats": ["Dumbbells", "Bodyweight"],
  "Reverse Lunges": ["Dumbbells", "Bodyweight", "Resistance Bands"],
  "Deadlifts": ["Barbells", "Dumbbells", "Resistance Bands"],
  "Romanian Deadlifts": ["Barbells", "Dumbbells", "Resistance Bands"],
  "Straight Leg Deadlifts": ["Barbells", "Dumbbells"],
  "Trap Bar Deadlifts": ["Trap Bar"],
  "Hamstring Walkbacks": ["Bodyweight"],
  "Bench Press": ["Barbells", "Weight Machines"],
  "Incline Bench Press": ["Barbells"],
  "Military Press": ["Barbells", "Dumbbells"],
  "Overhead Tricep Extensions": ["Dumbbells", "Resistance Bands"],
  "Back Rows": ["Barbells", "Dumbbells", "Cables"],
  "Upper Back Row": ["Cables"],
  "Bicep Curls": ["Dumbbells", "Cables", "Resistance Bands"],
  "Hammer Curls": ["Dumbbells"],
  "Push-ups": ["Bodyweight"],
  "Chest Dips": ["Bodyweight"],
  "Medicine Ball Push Ups": ["Bodyweight"],
  "Pull-ups": ["Bodyweight"],
  "Dips": ["Bodyweight"],
  "Lunges": ["Bodyweight", "Dumbbells"],
  "Frog Squats": ["Bodyweight"]
};

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

  populateExerciseDropdown(); // re-run if needed
}

function populateExerciseDropdown() {
  const location = document.getElementById("location").value;
  const focus = document.getElementById("focus").value;
  const equipment = document.getElementById("equipmentDropdown").value;
  const exerciseDropdown = document.getElementById("exerciseDropdown");

  exerciseDropdown.innerHTML = "<option value='' disabled selected>Select an Exercise</option>";

  if (!location || !focus || !equipment) return;

  const baseExercises = allExercises[focus]?.[location] || [];

  const filtered = baseExercises.filter(exercise => {
    const validEquip = exerciseEquipmentMap[exercise];
    return validEquip && validEquip.includes(equipment);
  });

  filtered.forEach(exercise => {
    const option = document.createElement("option");
    option.value = exercise;
    option.textContent = exercise;
    exerciseDropdown.appendChild(option);
  });
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

  const tableBody = focus === "Upper" ? document.querySelector("#upperBodyTable tbody") : document.querySelector("#lowerBodyTable tbody");

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
}

document.getElementById("defaultOpen").click();
