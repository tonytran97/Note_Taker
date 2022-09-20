// dependencies 
const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');

// access to our stored database
const db = require('./db/db.json');

// helper method that generates unique IDs
const uuid = require('./helper/uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON
app.use(express.json());
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
    // res.json(`${req.method} request received`);
    console.log("Request to post a note has been received");
    // destructuring of the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        // reads the db.json data and converts it into a Javascript object
        const readNotes = JSON.parse(fs.readFileSync(`./db/db.json`));
        // push the newNote object onto the newly generated Javascript object from the database
        readNotes.push(newNote);
        // converts the Javascript object into a string
        const noteString = JSON.stringify(readNotes);

        // the new string is pushed back into the database
        fs.writeFile(`./db/db.json`, noteString, (err) =>
        err ? console.error(err) : console.log(`New note has been created`));
        res.status(201).json(readNotes);
    } else {
        res.status(500).json(`Error in creating a new note`);
    }
})

// delete request to clear out a note on the click of the trash bin
app.delete('/api/notes/:note_id', (req, res) => {
    console.log("Request to delete a note has been received");
    checkNote = req.params.note_id;
    // reads the db.json data and converts it into a Javascript object
    let readNotes = JSON.parse(fs.readFileSync(`./db/db.json`));
    // filter method returns a new array without the deleted note
    readNotes = readNotes.filter(function(notes) {
        return notes.note_id !== `${checkNote}`;
    });
    const noteString = JSON.stringify(readNotes);
    fs.writeFile(`./db/db.json`, noteString, (err) =>
        err ? console.error(`Note not deleted`) : console.log(`Success, note has been deleted from list`));
        res.status(202).json(readNotes);
});

app.listen(PORT, () => console.log(`Note app listening at http://localhost:${PORT}`));