const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// ROUTE-1 Fetch all notes: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal errror occured");
    }

})

// ROUTE-2 Add notes: POST "/api/notes/addnotes"
router.post('/addnotes', fetchuser, [
    body('title', 'Enter Title').isLength({ min: 3 }),
    body('description', 'Enter Description').isLength({ min: 5 }),
], async(req, res) => {
    const { title, description,tag } = req.body;
    //if there are errors then return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await notes.save()
        res.json(savedNotes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal errror occured");
    }
})
module.exports = router