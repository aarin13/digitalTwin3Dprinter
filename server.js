const express = require("express");
const app = express();
const fs = require("fs");
const { parse } = require("csv-parse");
const columnsToKeep = [2, 4, 6, 8];
let lastRow = null;



// WebSockets setup
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8083 });




// Function to read the CSV file and update the lastRow variable
function readAndUpdateData() {
  fs.createReadStream("C://Users//HP//Desktop//dtwin_native//dt1.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      lastRow = row.map((value) => parseFloat(value));
    })
    .on("end", function () {
      if (lastRow) {
        const filteredRow = lastRow.filter((value, index) => columnsToKeep.includes(index + 1));
        console.log("Updated data:", filteredRow);
        // Send the updated data to connected WebSocket clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(filteredRow));
          }
        });
      }
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

// Initial data read and update
readAndUpdateData();

// Schedule the data update 
const updateInterval = 1000; 
setInterval(readAndUpdateData, updateInterval);

// Call the function to update dt2.csv every minute (60 seconds)
function file2updatewith1() {
  const data = fs.readFileSync("C://Users//HP//Desktop//dtwin_native//dt1.csv");
  fs.appendFileSync("C://Users//HP//Desktop//dtwin_native//dt2.csv", data);
  fs.truncateSync("C://Users//HP//Desktop//dtwin_native//dt1.csv");
}

setInterval(file2updatewith1, 60000);


// WebSocket connection handling
wss.on("connection", function connection(ws) {
  console.log("WebSocket client connected");
});

app.get("/data", (req, res) => {
  if (lastRow) {
    const filteredRow = lastRow.filter((value, index) => columnsToKeep.includes(index + 1));
    res.json(filteredRow);
  } else {
    res.status(500).json({ error: "No data available." });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(1020, () => {
  console.log("Server is running on http://localhost:1020");
});
