const express = require('express');
// We no longer need the 'path' module, as we'll use process.cwd()
// const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3000; 

// Define the root path of the project once
const projectRoot = process.cwd();

// 1. MIDDLEWARE: Serve Static Files (The Frontend)
// We use the absolute path to the public folder.
app.use(express.static(projectRoot + '/public')); 

// 2. API ROUTE: The dynamic backend logic
app.get('/api/events', (req, res) => {
    const mockEvents = [
        { id: 1, name: "Sample Event", date: "2026-02-01", location: "Town Hall" },
    ];
    res.json(mockEvents); 
});

// 3. CATCH-ALL ROUTE (Must be the last one defined!)
// This sends the index.html from the absolute path.
app.get('/*', (req, res) => {
    res.sendFile(projectRoot + '/public/index.html');
});

// 4. START THE SERVER
// Binds to '0.0.0.0' for stability on hosting platforms.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});