// Import the Express library - this gives us tools to create a web server
const express = require('express');

// Import CORS library - this allows our server to accept requests from different websites
const cors = require('cors');

// Create an Express application - this is our web server
const app = express();

// Get the port number from environment variables, or use 5000 as default
// Environment variables let us configure the app without changing code
const PORT = process.env.PORT || 5000;

// Create an empty array to store all curse logs in memory
// This will reset every time we restart the server
const curseLog = [];

// Variable to track the last time someone made a curse request
// We'll use this to enforce the 5-second cooldown
let lastCurseTime = 0;

// Add CORS middleware - allows requests from other websites/domains
// Without this, browsers would block requests from frontend apps
app.use(cors());

// Add JSON middleware - tells Express to automatically parse JSON from request bodies
// This converts JSON strings into JavaScript objects we can use
app.use(express.json());

// POST route to log a new curse
// When someone sends a POST request to /curse, this function runs
app.post('/curse', (req, res) => {
  // Get the current time in milliseconds since 1970 (Unix timestamp)
  const currentTime = Date.now();
  
  // Check if 5 seconds (5000 milliseconds) have passed since last curse
  if (currentTime - lastCurseTime < 5000) {
    // If not enough time has passed, send an error response
    return res.status(429).json({ 
      error: 'Cooldown active. Please wait before cursing again.',
      timeRemaining: Math.ceil((5000 - (currentTime - lastCurseTime)) / 1000)
    });
  }
  
  // Extract the curse type from the request body
  // req.body contains the JSON data sent by the client
  const { type } = req.body;
  
  // Check if the curse type was provided
  if (!type) {
    // If no type provided, send an error response
    return res.status(400).json({ error: 'Curse type is required' });
  }
  
  // Create a new curse entry with type and current timestamp
  const curseEntry = {
    type: type,
    time: new Date().toISOString() // Convert current time to readable string format
  };
  
  // Add the new curse to our in-memory array
  curseLog.push(curseEntry);
  
  // Update the last curse time to enforce cooldown
  lastCurseTime = currentTime;
  
  // Send success response back to the client
  res.status(201).json({ 
    message: 'Curse logged successfully',
    curse: curseEntry
  });
});

// GET route to retrieve all curse logs
// When someone sends a GET request to /curse-log, this function runs
app.get('/curse-log', (req, res) => {
  // Send back the entire curse log array as JSON
  res.json({
    curses: curseLog,
    total: curseLog.length // Also include the total count for convenience
  });
});

// Start the server and listen for incoming requests
// This makes our server available at http://localhost:5000 (or whatever PORT is set to)
app.listen(PORT, () => {
  // This message prints to the console when the server successfully starts
  console.log(`Curse logging server is running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});