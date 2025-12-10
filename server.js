const express = require('express');
const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3000; 

// 1. MIDDLEWARE: Serve Static Files (The Frontend)
// This tells Express to look inside the 'public' folder for files like index.html and app.js
app.use(express.static(path.join(__dirname, 'public'))); 

// ----------------------------------------------------
// 2. API ROUTE: The dynamic backend logic
// ----------------------------------------------------

// This route provides the list of events to your React frontend.
app.get('/api/events', (req, res) => {
    // This will be replaced with MongoDB logic later
    const mockEvents = [
        { id: 1, name: "Sample Event", date: "2026-02-01", location: "Town Hall" },
    ];
    res.json(mockEvents); 
});

// ----------------------------------------------------
// 3. CATCH-ALL ROUTE (Must be the last one defined!)
// ----------------------------------------------------

// This handles all URLs (including the root '/') that didn't match
// an API route, ensuring your React app always loads.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------------
// 4. START THE SERVER
// ----------------------------------------------------

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});