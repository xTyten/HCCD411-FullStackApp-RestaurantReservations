// Sets up Input & Button to generate tables
const createTablesInput = document.querySelector('#createTablesInput');
const createTablesButton = document.querySelector('#createTablesButton');

createTablesButton.addEventListener('click', (e) => {
  createTables();
})

function createTables() {
  const tablesContainer = document.querySelector('#tables')
  tablesContainer.innerHTML = '';

  let numTables = parseInt(createTablesInput.value);
  for (let i=1; i<numTables+1; i++) {
    // div to hold table
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("table");
    tableContainer.id = "table" + i;

    // h3 for table name
    let tableH3 = document.createElement("h3");
    let tableH3Text = document.createTextNode("Table "+i);
    tableH3.appendChild(tableH3Text);
    tableContainer.appendChild(tableH3);

    // Name label and input
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "name" + i);
    nameLabel.textContent = "Name";
    tableContainer.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.id = "name" + i;
    nameInput.placeholder = "John Doe";
    nameInput.required = true;
    tableContainer.appendChild(nameInput);

    // Phone label and input
    let phoneLabel = document.createElement("label");
    phoneLabel.setAttribute("for", "phone" + i);
    phoneLabel.textContent = "Phone number";
    tableContainer.appendChild(phoneLabel);

    let phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.name = "phone";
    phoneInput.id = "phone" + i;
    phoneInput.placeholder = "(123) 456-7890";
    phoneInput.required = true;
    tableContainer.appendChild(phoneInput);

    // Guests label and input
    let guestsLabel = document.createElement("label");
    guestsLabel.setAttribute("for", "guests" + i);
    guestsLabel.textContent = "Number of guests";
    tableContainer.appendChild(guestsLabel);

    let guestsInput = document.createElement("input");
    guestsInput.type = "number";
    guestsInput.name = "guests";
    guestsInput.id = "guests" + i;
    guestsInput.placeholder = "4";
    guestsInput.required = true;
    tableContainer.appendChild(guestsInput);

    // Date label and input
    let dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "date" + i);
    dateLabel.textContent = "Date";
    tableContainer.appendChild(dateLabel);

    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "date";
    dateInput.id = "date" + i;
    dateInput.required = true;
    tableContainer.appendChild(dateInput);

    // Time label and input
    let timeLabel = document.createElement("label");
    timeLabel.setAttribute("for", "time" + i);
    timeLabel.textContent = "Time";
    tableContainer.appendChild(timeLabel);

    let timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.name = "time";
    timeInput.id = "time" + i;
    timeInput.required = true;
    tableContainer.appendChild(timeInput);

    // Reserve button
    let reserveBtn = document.createElement("button");
    reserveBtn.type = "button";
    reserveBtn.classList.add("reserve");
    reserveBtn.textContent = "Reserve Table";
    tableContainer.appendChild(reserveBtn);

    // adds the created table to tablesContainer
    tablesContainer.appendChild(tableContainer);
  }

  // adds event listeners to the reserve button
  const tables = document.querySelectorAll('.table');
  tables.forEach(table => {
    const reserveButton = table.querySelector('.reserve');
    reserveButton.addEventListener('click', (e) => {
      makeReservation(table);
    })
  });
};

// Changed so that loadReservations() runs after every create, update, delete
const refreshReservationsButton = document.querySelector("#loadReservations");
refreshReservationsButton.addEventListener('click', (e) => {
  loadReservations();
});

function makeReservation(table) {
  const reservation = {
    table: table.querySelector('h3').textContent,
    name: table.querySelector('input[name="name"]').value,
    phone: table.querySelector('input[name="phone"]').value,
    guests: table.querySelector('input[name="guests"]').value,
    date: table.querySelector('input[name="date"]').value,
    time: table.querySelector('input[name="time"]').value
  };
  console.log('Reservation info:', reservation);

  // Send reservation to server
  const request = new XMLHttpRequest();
  request.open("POST", "http://127.0.0.1:4000/reservations", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status == 200) {
      console.log("Server response: ", request.responseText);
      // alert(request.responseText);
      loadReservations();
    } else if (request.status == 409) {
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else { // Server error
      console.error("Error: ", request.statusText);
      alert("Failed to save reservation. (server)");
    }
  }
  // Network error here
  request.onerror = function() {
    console.error('Network error');
    alert('Failed to save reservation. (network)');
  };
  // Send the reservation
  request.send(JSON.stringify(reservation));
}

function updateReservation(reservation) {
  const updatedReservation = {
    id: parseInt(reservation.querySelector('.reservationId').textContent),
    table: reservation.querySelector('input[name="table"]').value,
    name: reservation.querySelector('input[name="name"]').value,
    phone: reservation.querySelector('input[name="phone"]').value,
    guests: reservation.querySelector('input[name="guests"]').value,
    date: reservation.querySelector('input[name="date"]').value,
    time: reservation.querySelector('input[name="time"]').value
  };
  console.log('Updated reservation info:', updatedReservation);

  // Send reservation to server
  const request = new XMLHttpRequest();
  request.open("PUT", `http://127.0.0.1:4000/reservations/${updatedReservation.id}`, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status == 200) {
      console.log("Server response: ", request.responseText);
      // alert(request.responseText);
      loadReservations();
    } else if (request.status == 404) {
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else if (request.status == 409) {
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else { // Server error
      console.error("Error: ", request.statusText);
      alert("Failed to save reservation. (server)");
    }
  }
  // Network error here
  request.onerror = function() {
    console.error('Network error');
    alert('Failed to save reservation. (network)');
  };
  // Send the reservation
  request.send(JSON.stringify(updatedReservation));
}

function deleteReservation(reservation) {
  const reservationToDelete = {
    id: parseInt(reservation.querySelector('.reservationId').textContent),
    table: reservation.querySelector('input[name="table"]').value,
    name: reservation.querySelector('input[name="name"]').value,
    phone: reservation.querySelector('input[name="phone"]').value,
    guests: reservation.querySelector('input[name="guests"]').value,
    date: reservation.querySelector('input[name="date"]').value,
    time: reservation.querySelector('input[name="time"]').value
  };
  console.log('Reservation to delete info:', reservationToDelete);

  // Send reservation to server
  const request = new XMLHttpRequest();
  request.open("DELETE", `http://127.0.0.1:4000/reservations/${reservationToDelete.id}`, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status == 200) {
      console.log("Server response: ", request.responseText);
      // alert(request.responseText);
      loadReservations();
    } else if (request.status == 404) {
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else { // Server error
      console.error("Error: ", request.statusText);
      alert("Failed to save reservation. (server)");
    }
  }
  // Network error here
  request.onerror = function() {
    console.error('Network error');
    alert('Failed to save reservation. (network)');
  };
  // Send the reservation
  request.send(JSON.stringify(reservationToDelete));
}

// Helper function to create label inputs for loadReservations()
function createLabeledInput(labelText, inputType, inputName, inputValue) {
  const label = document.createElement('label');
  label.textContent = labelText;
  
  const input = document.createElement('input');
  input.type = inputType;
  input.name = inputName;
  input.value = inputValue;
  input.required = true;
  
  label.appendChild(input);
  return label;
}

function loadReservations() {
  const request = new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:4000/reservations", true);

  request.onload = function () {
    if (request.status === 200) {
      const reservations = JSON.parse(request.responseText);
      console.log(reservations);
      const reservationsContainer = document.querySelector("#reservationsContainer");
      reservationsContainer.innerHTML = ''; // Clear existing list
      
      reservations.forEach((reservation) => {
        // Container <div>
        const reservationDiv = document.createElement('div');
        reservationDiv.classList.add('reservation');
        
        // ID <p>
        const idSpan = document.createElement('span');
        idSpan.textContent = `${reservation.id}`;
        idSpan.classList.add("reservationId");
        const idP = document.createElement('p');
        idP.textContent = `ID: `;
        idP.appendChild(idSpan);
        reservationDiv.appendChild(idP);
        
        // Create all input fields
        // (labelText, inputType, inputName, inputValue)
        reservationDiv.appendChild(createLabeledInput('Table', 'text', 'table', reservation.table));
        reservationDiv.appendChild(createLabeledInput('Name', 'text', 'name', reservation.name));
        reservationDiv.appendChild(createLabeledInput('Phone number', 'tel', 'phone', reservation.phone));
        reservationDiv.appendChild(createLabeledInput('Number of guests', 'number', 'guests', reservation.guests));
        reservationDiv.appendChild(createLabeledInput('Date', 'date', 'date', reservation.date));
        reservationDiv.appendChild(createLabeledInput('Time', 'time', 'time', reservation.time));
        
        // Create Update button
        const updateButton = document.createElement('button');
        updateButton.className = 'update';
        updateButton.textContent = 'Update';
        reservationDiv.appendChild(updateButton);
        
        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        reservationDiv.appendChild(deleteButton);
        
        // updateButton.addEventListener('click', () => updateReservation(reservationDiv));
        // deleteButton.addEventListener('click', () => deleteReservation(reservationDiv));
        updateButton.addEventListener('click', (e) => {
          updateReservation(reservationDiv);
        });
        deleteButton.addEventListener('click', (e) => {
          deleteReservation(reservationDiv);
        });

        // Add the complete reservation div to the container
        reservationsContainer.appendChild(reservationDiv);
      });
    } else if (request.status == 404) {
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else if (request.status = 400){
      const response = JSON.parse(request.responseText);
      alert(response.message);
    } else {
      console.error("Error: ", request.statusText);
      alert("Failed to save reservation. (server)");
    }
  };
  request.onerror = function () {
    console.error('Network error');
    alert('Failed to save reservation. (network)');
  };
  request.send();
}
