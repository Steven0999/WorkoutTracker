  function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
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
    "Hinge": ["Hamstring Walkbacks"]
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

    populateExerciseDropdown(); // To handle cases when equipment is already selected and location is changed
  }

  function populateExerciseDropdown() {
    const focus = document.getElementById("focus").value;
    const equipmentDropdown = document.getElementById("equipmentDropdown");
    const exerciseDropdown = document.getElementById("exerciseDropdown");

    exerciseDropdown.innerHTML = "<option value='' disabled selected>Select an Exercise</option>";

    if (!focus || !equipmentDropdown.value) return; // Return if focus or equipment is not selected

    const selectedEquipment = equipmentDropdown.value;
    const location = document.getElementById("location").value;
    const exerciseOptions = location === "gym" ? gymExercises[focus] : homeExercises[focus];

    const filteredOptions = exerciseOptions.filter(exercise => {
      return location === "gym" ? gymExercises[focus].includes(exercise) : homeExercises[focus].includes(exercise);
    });

    filteredOptions.forEach(exercise => {
      const option = document.createElement("option");
      option.value = exercise;
      option.textContent = exercise;
      exerciseDropdown.appendChild(option);
    });
  }

  function saveData() {
    const equipment = document.getElementById("equipmentDropdown").value;
    const exercise = document.getElementById("exerciseDropdown").value;
    const sets = 3;  // Assuming sets is fixed at 3
    const reps = 10;  // Assuming reps is fixed at 10
    const weight = document.querySelector(".exercise-weight").value;
    const focus = document.getElementById("focus").value;

    if (!equipment || !exercise || !weight) {
      alert("Please fill in all the fields.");
      return;
    }

    const tableBody = focus === "Upper" ? document.querySelector("#upperBodyTable tbody") : document.querySelector("#lowerBodyTable tbody");

    const row = tableBody.insertRow();
    const equipmentCell = row.insertCell(0);
    const exerciseCell = row.insertCell(1);
    const setsCell = row.insertCell(2);
    const repsCell = row.insertCell(3);
    const weightCell = row.insertCell(4);
    const clearCell = row.insertCell(5);

    equipmentCell.textContent = equipment;
    exerciseCell.textContent = exercise;
    setsCell.textContent = sets;
    repsCell.textContent = reps;
    weightCell.textContent = weight;

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.className = "clear-button";
    clearButton.onclick = function() {
      tableBody.removeChild(row);
    };
    clearCell.appendChild(clearButton);

    document.getElementById("equipmentDropdown").value = "";
    document.getElementById("exerciseDropdown").value = "";
    document.querySelector(".exercise-weight").value = "";
  }

  document.getElementById("defaultOpen").click();
