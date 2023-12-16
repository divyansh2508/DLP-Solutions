const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();
MONGO_URL = 'mongodb+srv://divyansh:5KhWbpUiquWEIy3k@cluster0.rzlnxjd.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URL, {
    ssl: true,
  }).then(() => {
    console.log("Database Connected ✅");
  }).catch((error) => {
    console.error("Database Connection Error ❌", error);
});

const InsertionEvent = require('./Schema/insertion');
const EjectionEvent = require('./Schema/ejection');

app.use(express.json());

// Route for handling requests to receive logs
app.post('/receive-logs', async (req, res) => {
  try {
    const logData = req.body;
    console.log(logData);

    // Assuming logData has properties eventType, eventID, providerName, timeCreated, message
    if (logData.eventType === 'insertion') {
      // Create a new InsertionEvent instance
      const newInsertionEvent = new InsertionEvent(logData);

      // Save the instance to MongoDB
      await newInsertionEvent.save();

      console.log('Received and saved insertion event:', logData);
    } else if (logData.eventType === 'ejection') {
      // Create a new EjectionEvent instance
      const newEjectionEvent = new EjectionEvent(logData);

      // Save the instance to MongoDB
      await newEjectionEvent.save();

      console.log('Received and saved ejection event:', logData);
    } else {
      console.log('Unknown event type:', logData);
    }

    res.status(200).send('Log received and saved successfully');
  } catch (error) {
    console.error('Error processing log:', error);
    res.status(500).send('Internal Server Error');
  }
});
  
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

// Route for handling requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'public', 'index.html'));
});

//Route for handling requests to the root URL
app.get('/getNewEventsFromMongoDB', async (req, res) => {
  try {
    // Assuming you have a model named LogEvent in your Schema folder
    const Eject = require('./Schema/ejection');
    const Insert = require('./Schema/insertion');

    // Fetch data from MongoDB
    const ej = await Eject.find();
    const ins = await Insert.find();

    const combinedData = {
      ejection: ej,
      insertion: ins
    };

    res.status(200).json(combinedData); // Send a single response with combined data
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});
/*app.get('/oldlogs', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'public', 'oldLogs.html'));
});

app.get('/getOldLogs', (req, res) => {
  let data = Array();
  data.push(getRandomData());
  data.push(getRandomData());
  data.push(getRandomData());
  data.push(getRandomData());
  data.push(getRandomData());

  res.status(200).json(data).send();
});

// FUNCTIONS

function getRandomData() {
  function getRandomElementFromArray(arr) {
    if (arr.length === 0) {
      return null; // Return null for an empty array
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  events = ['Insertion', 'Ejection', 'Read', 'Create', 'Update', 'Delete'];
  user = ['Ayush', 'Jhon', 'Divyansh', 'Rashmi'];
  device = ['nimbus@133.152.53.125', 'nimbus@133.24.56.135', 'jojos@12.133.113.145'];

  data = {
    event: getRandomElementFromArray(events),
    user: getRandomElementFromArray(user),
    device: getRandomElementFromArray(device),
    timestamp: Date.now(),
  };
  return data;
}*/

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});