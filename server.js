const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

// get request for /notes will send the notes.html file
app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html')))

// sends the index.html file for when there are no matches to the requests above this
app.get('*', (req, res) => 
res.sendFile(path.join(__dirname, 'public/index.html')))

app.listen(PORT, () => 
console.log(`Test app listening at http://localhost:${PORT}`));