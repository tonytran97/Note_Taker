const express = require('express');
const path = require('path');
const db = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

// get request for /notes will send the notes.html file
app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html')));

// get request for notes that sends back a JSON file
app.get('/api/notes', (req, res) => res.json(db));

// sends the index.html file for when there are no matches to the requests above this
app.get('*', (req, res) => 
res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () => 
console.log(`Test app listening at http://localhost:${PORT}`));