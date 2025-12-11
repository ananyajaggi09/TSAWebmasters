const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const staticPath = path.resolve(__dirname, 'public');

app.use(express.static(staticPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});