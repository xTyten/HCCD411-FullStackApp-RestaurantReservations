// Server side
// http://127.0.0.1:4000/

const http = require('http');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const { allowedNodeEnvironmentFlags } = require('process');
const hostname = '127.0.0.1';
const port = 4000;

// callback function for when server is running
const server = http.createServer((req,res) => {
  res.statusCode = 200;
  res.setHeader('Content-type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const method = req.method;
  const url = req.url;
  // const {method, url} = req;

  res.write('Welcome to our web server!'); // Different from console.log(), sent over the network
  res.write(`Method: ${method}, URL: ${url}`);
  res.end(); // Done sending data

  // // Sending a POST request (sending data)
  // if (url === '/reserve' && method === 'POST') {
  //   // Collecting data from client
  //   let body = '';
  //   // the chunks of data is adding to the body string
  //   req.on('data', chunk => body += chunk);
  //   // callback function when finished
  //   req.on('end', () => {
  //     // turns received string into JSON
  //     const reservation = JSON.parse(body);

  //     // Saves to a JSON file
  //       // reads a reservations.json file or start with an empty errary if file is empty or doesn't exist
  //     const reservations = JSON.parse(fs.readFileSync('reservations.json', 'utf8') || '[]');
  //     reservations.push(reservation);
  //     fs.writeFileSync('reservations.json', JSON.stringify(reservations));

  //     // Sends back OK
  //     res.writeHead(200, {'Content-Type': 'text/plain'});
  //     res.end('Reservation saved successfully!');
  //   });
  // } else {
  //   // Request not found
  //   // res.writeHead(404, {'Content-Type': 'text/plain'});
  //   res.end("Not Found");
  // }
});

// "/" is root of folder
app.get('/', (req, res) => {
  // express lets us use res.send instead of res.write res.end
  res.send("Hello from GET!");
});

// For every case, we have a separate app.get call. More modular way for routing instead of big if statement
app.get('/getdog', (req, res) => {
  res.send("Here is a dog!");
});

// The colon indicates variable or placeholder dog name
app.get('/getdog/:dogName', (req, res) => {
  let dogName = req.params.dogName;
  res.send(`Here is a dog named ${dogName}!`);
});

app.get('/getdog/:dogName/owner/:ownerName', (req, res) => {
  let dogName = req.params.dogName;
  let ownerName = req.params.ownerName;
  res.send(`${dogName} belongs to ${ownerName}`);
});

app.post(`/`, (req, res) => {
  res.send('Hello from POST.');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));

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

// Start our server
server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});
