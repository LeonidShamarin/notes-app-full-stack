const express = require('express');
const router = express.Router();
const notesDB = require('../database');

router.get('/', async (req, res) => {
  try {
    const notes = await notesDB.getAllNotes();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await notesDB.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Error fetching note' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
   
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Note title and content are required' 
      });
    }
    
    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Note title and content cannot be empty' 
      });
    }
    
    const newNote = await notesDB.createNote(title.trim(), content.trim());
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Error creating note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
   
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Note title and content are required' 
      });
    }
    
    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Note title and content cannot be empty' 
      });
    }
    
    const updatedNote = await notesDB.updateNote(noteId, title.trim(), content.trim());
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.message === 'Note not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error updating note' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await notesDB.deleteNote(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error.message === 'Note not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error deleting note' });
    }
  }
});

module.exports = router;
