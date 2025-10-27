// Server side
// http://127.0.0.1:4000/

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); // lets Express parse JSON
const { allowedNodeEnvironmentFlags } = require('process');
const hostname = '127.0.0.1';
const port = 4000;

// "/" is root of folder
app.get('/', (req, res) => {
  // express lets us use res.send instead of res.write res.end
  res.send("Hello from GET!");
});

// For every case, we have a separate app.get call. More modular way for routing instead of big if statement
// Gets reservations
app.get('/reservations', (req, res) => {
  // res.send("Saved reservations should show up here");
  let read_reservations_str = fs.readFileSync("reservations.json");
  let read_reservations = JSON.parse(read_reservations_str);

  res.json(read_reservations);
  // res.send(read_reservations); // sends JSON string
});

// Helper function to calculate time to minutes
function timeToMinutes(timeString) {
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  return hours * 60 + minutes;
}
// Creates reservations
app.post('/reservations', (req, res) => {
  const reservation = req.body;
  console.log('Received reservation:', reservation);

  // Read existing reservations from file
  let data = [];
  const filePath = 'reservations.json';
    // Creates reservations.json if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  } else if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  // Estimated length for reservation
  const reservationDuration = 90;

  // Checks for conflicts with table, date, time
  const conflict = data.find(existingRes => {
    // Checks same table and same date and loops
    if (existingRes.table !== reservation.table || existingRes.date !== reservation.date) {
      return false;
    }

    // Converts to minutes
    const newStart = timeToMinutes(reservation.time);
    const newEnd = newStart + reservationDuration;
    const existingStart = timeToMinutes(existingRes.time);
    const existingEnd = existingStart + reservationDuration;
    
    // Checks if newStart is before existingEnd and if newEnd is after existingStart
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (conflict) {
    console.log('Conflict with time');
    return res.status(409).json({ 
      message: `This table is already reserved on ${conflict.time} on ${conflict.date}. Reservations need 1.5 hours between them.`
    });
  }

  // Creates an id for each reservation by adding 1 to the last reservation
  let nextId = 1;
  if (data.length > 0) {
    const lastReservation = data[data.length - 1];
    nextId = lastReservation.id + 1;
  }
  reservation.id = nextId;

  // Adds to list
  data.push(reservation);

  // Saves to JSON file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: 'Reservation saved successfully!', reservation });
});

// Start our server
app.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

// Updates reservations
app.put('/reservations/:id', (req, res) => {
  let reservationId = parseInt(req.params.id);
  const updatedReservation = req.body;
  console.log('Received updated reservation:', updatedReservation);

  // Read existing reservations from file
  let data = [];
  const filePath = 'reservations.json';
    // checks for reservation file
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Reservation file not found" });
  } else if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  // Estimated length for reservation
  const reservationDuration = 90;

  // Checks for conflicts with table, date, time
  const conflict = data.find(existingRes => {
    // Skips itself if it has the same ID
    if (existingRes.id === reservationId) {
      return false;
    }
    // Checks same table and same date and loops
    if (existingRes.table !== updatedReservation.table || existingRes.date !== updatedReservation.date) {
      return false;
    }

    // Converts to minutes
    const newStart = timeToMinutes(updatedReservation.time);
    const newEnd = newStart + reservationDuration;
    const existingStart = timeToMinutes(existingRes.time);
    const existingEnd = existingStart + reservationDuration;
    
    // Checks if newStart is before existingEnd and if newEnd is after existingStart
    return newStart < existingEnd && newEnd > existingStart;
  });

  if (conflict) {
    console.log('Conflict with time');
    return res.status(409).json({ 
      message: `This table is already reserved on ${conflict.time} on ${conflict.date}. Reservations need 1.5 hours between them.`
    });
  }

  // Finds the index using the reservationId
  const index = data.findIndex((reservation) => {
    return reservation.id == reservationId;
  });
  // If id index isn't found
  if (index === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Makes sure the ID stays the same and updates the reservation in the list
  updatedReservation.id = reservationId;
  data[index] = updatedReservation;

  // Saves to JSON file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: 'Reservation updated successfully!', updatedReservation });
});

// Deletes reservations
app.delete('/reservations/:id', (req, res) => {
  let reservationId = parseInt(req.params.id);
  const reservationToDelete = req.body;
  console.log('Received reservation to delete:', reservationToDelete);

  // Read existing reservations from file
  let data = [];
  const filePath = 'reservations.json';
    // checks for reservation file
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Reservation file not found" });
  } else if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  // Finds the index using the reservationId
  const index = data.findIndex((reservation) => {
    return reservation.id == reservationId;
  });
  // If id index isn't found
  if (index === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Makes sure the ID stays the same and updates the reservation in the list
  // .splice(indexNumber, numberOfItems)[returns 0th index of the deleted list]
  const deletedReservation = data.splice(index, 1)[0];

  // Saves to JSON file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: 'Reservation deleted successfully!', deletedReservation });
});

// Start our server
app.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

// GET /reservations/all
// GET /reservations/01_01_2025
// GET /reservations/01_01_2025/table7
// GET /reservations/customerName/Smith
// GET /reservations/customerID/1234
// PUT /reservations/update/Smith/newTime/0500
// DELETE /reservations/customerID/1234

// REST encourages "Loose Coupling"
// RESTful
// /weather/rainfallAmount/June15_2016
// Not RESTful
// /retrieveRainfall.jsp?date=June15_2016

// CREATE -> POST / PUT
// READ -> GET
// UPDATE -> PUT / PATCH / POST
// DELETE -> DELETE

// PUT is Idempotent ! ! ! not having different outcomes no matter of how many times you have sent a request to the server. Only 1 PUT per action.
// PATCH partially updates a resource