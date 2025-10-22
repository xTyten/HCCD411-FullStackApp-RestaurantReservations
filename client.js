const tables = document.querySelectorAll('.table');
tables.forEach(table => {
  const reserveButton = table.querySelector('.reserve');
  reserveButton.addEventListener('click', () => makeReservation(table));
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

// function loadReservations() {
//   const request = new XMLHttpRequest();
//   request.open("GET", "http://127.0.0.1:4000/reservations", true);

//   request.onload = function () {
//     if (request.status === 200) {
//       const reservations = JSON.parse(request.responseText);
//       const ul = document.getElementById("reservations");
//       ul.innerHTML = ""; // Clear existing list

//       // Sort by date and time
//       reservations.sort((a, b) => {
//         const dateTimeA = new Date(`${a.date}T${a.time}`);
//         const dateTimeB = new Date(`${b.date}T${b.time}`);
//         return dateTimeA - dateTimeB;
//       });

//       // Create list items
//       reservations.forEach(r => {
//         const li = document.createElement("li");
//         li.textContent = `#${r.id} - ${r.date} ${r.time} - Table ${r.table} - ${r.name} (${r.guests} guests, ${r.phone})`;
//         ul.appendChild(li);
//       });
//     } else {
//       console.error("Failed to load reservations:", request.statusText);
//     }
//   };
//   request.onerror = function () {
//     console.error("Network error while loading reservations.");
//   };
//   request.send();
// }