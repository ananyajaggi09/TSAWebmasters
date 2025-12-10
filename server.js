const express = require('express');
const path = require('path'); // We must re-import the path module
const app = express();
const PORT = process.env.PORT || 3000; 

// We define the static folder using path.resolve()
const staticPath = path.resolve(__dirname, 'public');

// 1. MIDDLEWARE: Serve Static Files (The Frontend)
app.use(express.static(staticPath)); 

// 2. API ROUTE: The dynamic backend logic
app.get('/api/events', (req, res) => {
    const mockEvents = [
        { id: 1, name: "Sample Event", date: "2026-02-01", location: "Town Hall" },
    ];
    res.json(mockEvents); 
});

// 3. CATCH-ALL ROUTE (Must be the last one defined!)
// We send the index.html from the resolved static path.
app.get('/*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// 4. START THE SERVER
// Binds to '0.0.0.0' for stability on hosting platforms.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});