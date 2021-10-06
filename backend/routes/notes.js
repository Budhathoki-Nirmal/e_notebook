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
], async (req, res) => {
    const { title, description, tag } = req.body;
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

//ROUTE-3 Update notes: PUT "/api/notes/updatenotes"
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };
    //find the to be updated and update it
    let notes = await Notes.findById(req.params.id);
    if (!notes) { return res.status(404).send("Not Found") }
    if (notes.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
    }
    notes=await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
    res.json({notes});
})

module.exports = router