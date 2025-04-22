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
  "Fullbody": ["Bench Press", "Incline Bench Press", "Barbell Pullover", "Back Rows", "Upper Back Row", "Military Press", "Wide Grip Upright Rows", "Bicep Curls", "Drag Curls", "Spider Curls", "Hammer Curls", "Preacher Curls", "Skull Crushers", "Overhead Tricep Extensions", "Close Grip Barbell Press", "Squats", "Split Squats", "Bulgarian Split Squats", "B-Stance Squats", "Reverse Lunges", "Lunges", "Deadlifts", "Romanian Deadlifts", "Straight Leg Deadlifts", "Sumo Deadlifts", "Trap Bar Deadlifts", "Hip Thrusts"],
  "Upper": ["Bench Press", "Incline Bench Press", "Barbell Pullover", "Back Rows", "Upper Back Row", "Military Press", "Wide Grip Upright Rows", "Bicep Curls", "Drag Curls", "Spider Curls", "Hammer Curls", "Preacher Curls", "Skull Crushers", "Overhead Tricep Extensions", "Close Grip Barbell Press"],
  "Lower": ["Squats", "Split Squats", "Bulgarian Split Squats", "B-Stance Squats", "Reverse Lunges", "Lunges", "Deadlifts", "Romanian Deadlifts", "Straight Leg Deadlifts", "Sumo Deadlifts", "Trap Bar Deadlifts", "Hip Thrusts"],
  "Push": ["Bench Press", "Incline Bench Press", "Barbell Pullover", "Military Press", "Wide Grip Upright Rows", "Skull Crushers", "Overhead Tricep Extensions", "Close Grip Barbell Press"],
  "Pull": ["Back Rows", "Upper Back Row", "Bicep Curls", "Drag Curls", "Spider Curls", "Hammer Curls", "Preacher Curls"],
  "Squats": ["Squats", "Split Squats", "Bulgarian Split Squats", "B-Stance Squats", "Reverse Lunges", "Lunges"],
  "Hinge": ["Deadlifts", "Romanian Deadlifts", "Straight Leg Deadlifts", "Sumo Deadlifts", "Trap Bar Deadlifts", "Hip Thrusts"]
};

const homeExercises = {
  "Fullbody": ["Push-ups", "Decline Push Ups", "Medicine Ball Push Ups", "Chest Dips", "Pull-ups", "Dips", "Polar Press", "Crocodile Push Ups", "Squats", "Lunges", "Reverse Lunges", "Frog Squats", "Hamstring Walkbacks"],
  "Upper": ["Push-ups", "Decline Push Ups", "Medicine Ball Push Ups", "Chest Dips", "Pull-ups", "Dips", "Polar Press", "Crocodile Push Ups"],
  "Lower": ["Squats", "Lunges", "Reverse Lunges", "Frog Squats", "Hamstring Walkbacks"],
  "Push": ["Push-ups", "Decline Push Ups", "Medicine Ball Push Ups", "Chest Dips", "Dips", "Polar Press", "Crocodile Push Ups"],
  "Pull": ["Pull-ups"],
  "Squats": ["Squats", "Lunges", "Reverse Lunges", "Frog Squats"],
  "Hinge": ["Hamstring Walkbacks"],
  "Core": ["Standing Twists", "Heel Taps", "Crunches", "V sit", "Hand Walk Outs", "Reverse Crunches"]
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

  populateExerciseDropdown(); // refresh exercises if needed
}

function populateExerciseDropdown() {
  const location = document.getElementById("location").value;
  const focus = document.getElementById("focus").value;
  const equipment = document.getElementById("equipmentDropdown").value;
  const exerciseDropdown = document.getElementById("exerciseDropdown");

  exerciseDropdown.innerHTML = "<option value='' disabled selected>Select an Exercise</option>";

  if (!location || !focus || !equipment) return;

  const exerciseOptions = location === "gym" ? gymExercises[focus] : homeExercises[focus];

  exerciseOptions.forEach(exercise => {
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
