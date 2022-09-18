const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const db = require('./db/db.json');

// helper method that generates unique IDs
const uuid = require('./helper/uuid');

const app = express();
const PORT = 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// get request for /notes will send the notes.html file
app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html')));

// this creates a promise of the fs.readFile 
const readFromFile = util.promisify(fs.readFile);

// get request for notes that sends back a JSON file
app.get('/api/notes', (req, res) => {
    // by using a promise, the saved notes are instantly loaded onto the new page
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// sends the index.html file for when there are no matches to the requests above this
app.get('*', (req, res) => 
res.sendFile(path.join(__dirname, 'public/index.html')));

// post request to save new notes
app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request received`);

    // the post request is logged into the terminal when the save button is clicked
    console.info(`${req.method} request received, a note has been created`);

    // destructuring of the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);

        // reads the db.json data and converts it into a Javascript object
        const readNotes = JSON.parse(fs.readFileSync(`./db/db.json`));
        console.log(readNotes);
        // push the newNote object onto the newly generated Javascript object from the database
        readNotes.push(newNote);
        console.log(readNotes);
        // converts the Javascript object into a string
        const noteString = JSON.stringify(readNotes);

        // the new string is pushed back into the database
        fs.writeFile(`./db/db.json`, noteString, (err) =>
        err ? console.error(err) : console.log(`New note has been written to the JSON file`));
        res.status(201).json(response);
    } else {
        res.status(500).json(`Error in creating a new note`);
    }
})

app.listen(PORT, () => 
console.log(`Note app listening at http://localhost:${PORT}`));