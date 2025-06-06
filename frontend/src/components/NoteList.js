import React, { useState } from 'react';

const NoteItem = ({ note, updateNote, deleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsUpdating(true);

    try {
      await updateNote({
        id: note.id,
        title: editTitle.trim(),
        content: editContent.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);

      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US'); 
  };

  if (isEditing) {
    return (
      <div className="note-item editing">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isUpdating}
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="4"
            disabled={isUpdating}
          />
        </div>

        <div className="note-actions">
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !editTitle.trim() || !editContent.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-meta">
        <small>Created: {formatDate(note.createdAt)}</small>
        {note.updatedAt !== note.createdAt && (
          <small>Updated: {formatDate(note.updatedAt)}</small>
        )}
      </div>

      <div className="note-actions">
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="delete-btn"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

const NoteList = ({ notes, updateNote, deleteNote }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="note-list">
        <h2>No notes found</h2>
        <p>Create your first note using the form above.</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      <h2>Your Notes ({notes.length})</h2>
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          updateNote={updateNote}
          deleteNote={deleteNote}
        />
      ))}
    </div>
  );
};

export default NoteList;
