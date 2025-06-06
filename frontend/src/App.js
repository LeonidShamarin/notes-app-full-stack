import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import { fetchNotes, createNote, updateNote as updateNoteAPI, deleteNote as deleteNoteAPI } from './hooks/useNotes';
import './styles/App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedNotes = await fetchNotes();
        setNotes(fetchedNotes || []);
      } catch (err) {
        console.error('Error loading notes:', err);
        setError('Failed to load notes. Make sure the server is running.');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    getNotes();
  }, []);

  const addNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      if (newNote && newNote.id) {
        setNotes(prevNotes => [newNote, ...prevNotes]);
      }
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Failed to create note');
    }
  };

  const updateNote = async (updatedNoteData) => {
    try {
      const updatedNote = await updateNoteAPI(updatedNoteData);
      if (updatedNote && updatedNote.id) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
          )
        );
      }
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Failed to update note');
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  const filteredNotes = notes.filter(note => {
    if (!note || !note.title) return false;

    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || new Date(note.createdAt) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(note.createdAt) <= new Date(endDate);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  if (loading) {
    return (
      <div className="app">
        <h1>Note Management System</h1>
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Note Management System</h1>

      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="search-filters">
        <input 
          type="text" 
          placeholder="Search notes by title" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        <div className="date-filters">
          <label>Start date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />

          <label>End date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
      </div>

      <NoteForm addNote={addNote} />
      <NoteList 
        notes={filteredNotes} 
        updateNote={updateNote} 
        deleteNote={deleteNote} 
      />
    </div>
  );
};

export default App;
