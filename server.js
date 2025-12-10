// Import necessary modules
const express = require('express');
const path = require('path'); 
const app = express();

// Render provides the port in an environment variable, 
// but we use 3000 as a fallback for local testing.
const PORT = process.env.PORT || 3000; 

// ----------------------------------------------------
// 1. MIDDLEWARE: Serve Static Files (The Frontend)
// ----------------------------------------------------

// This line tells Express to look inside the 'public' folder 
// for static assets like index.html, app.js, and any CSS/images.
app.use(express.static(path.join(__dirname, 'public'))); 

// ----------------------------------------------------
// 2. ROUTES: API Endpoints (The Dynamic Backend Logic)
// ----------------------------------------------------

// Test Route: This route sends a list of dummy events.
// Your React frontend (app.js) will call this endpoint at /api/events
app.get('/api/events', (req, res) => {
    // In the future, this is where you will add code to fetch data from MongoDB!
    const mockEvents = [
        { id: 1, name: "Community Forum", date: "2026-02-01", location: "Town Hall" },
        { id: 2, name: "Tech Workshop", date: "2026-02-15", location: "Online" },
        { id: 3, name: "Student Leadership Day", date: "2026-03-05", location: "High School" }
    ];
    res.json(mockEvents); // Sends the data back as JSON
});

// Default Route: Serves the main index.html file for any unmatched routes.
// This is essential for Single Page Applications (SPAs) like React.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------------
// 3. START THE SERVER
// ----------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});