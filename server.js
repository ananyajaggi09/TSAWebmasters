const express = require('express');
const path = require('path'); 
const app = express();
const PORT = process.env.PORT || 3000; 

// 1. MIDDLEWARE: Serve Static Files (The Frontend)
app.use(express.static(path.join(__dirname, 'public'))); 

// 2. DEFAULT ROUTE: Serves index.html when visiting the base URL (http://your-app.com/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. API ROUTE: The dynamic backend logic
app.get('/api/events', (req, res) => {
    // This will be replaced with MongoDB logic later
    const mockEvents = [
        { id: 1, name: "Sample Event", date: "2026-02-01", location: "Town Hall" },
    ];
    res.json(mockEvents); 
});

// 4. CATCH-ALL ROUTE: Must be the last one defined!
// This sends the index.html for any other URL (e.g., /about, /details/123).
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. START THE SERVER
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});