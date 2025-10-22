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
  request.open("POST", "http://127.0.0.2:3000/reserve", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    if (request.status == 200) {
      console.log("Server response: ", request.responseText);
      alert(request.responseText);
    } else {
      console.error("Error: ", request.statusText);
      alert("Failed to save reservation.");
    }
  }
  // Error here
  request.onerror = function() {
    console.error('Network error');
    alert('Failed to save reservation.');
  };

  // Send the reservation
  request.send(JSON.stringify(reservation));
}

function sendRequest() {
  console.log("Button pressed");

  // const request = new XMLHttpRequest();
  // request.open("GET", "http://127.0.0.1:3000/getcat", true);

  // request.onload = function () {
  //   if (request.status == 200) {
  //     const pText = document.createTextNode("Request Received");
  //     p.appendChild(pText);
  //   } else {
  //     console.log(`Error occurred: Status ${request.status}`);
  //   }
  // }

  // request.send();

  const request = new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:3000/getcat", true);

  request.onload = function () {
    if (request.status == 200) {
      const responseText = request.responseText; // This returns the server response
      // console.log(typeof responseText); It's a String
      const pText = document.createTextNode(responseText);
      p.appendChild(pText);
    } else {
      console.log(`Error occurred: Status ${request.status}`);
    }
  }
  request.send();
}