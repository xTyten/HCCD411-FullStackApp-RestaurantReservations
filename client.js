const tables = document.querySelectorAll('.table');
tables.forEach(table => {
  const reserveButton = table.querySelector('.reserve');
  reserveButton.addEventListener('click', () => makeReservation(table));
});

const refreshReservationsButton = document.querySelector("#loadReservations");
refreshReservationsButton.addEventListener('click', loadReservations);

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
      alert(request.responseText);
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
    id: reservation.querySelector('.reservationId').textContent,
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
      alert(request.responseText);
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
        const updateBtn = document.createElement('button');
        updateBtn.className = 'update';
        updateBtn.textContent = 'Update';
        reservationDiv.appendChild(updateBtn);
        
        // Create Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Delete';
        reservationDiv.appendChild(deleteBtn);
        
        updateBtn.addEventListener('click', () => updateReservation(reservationDiv));

        // Add the complete reservation div to the container
        reservationsContainer.appendChild(reservationDiv);
      });

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