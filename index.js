const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/next-page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'next-page.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
