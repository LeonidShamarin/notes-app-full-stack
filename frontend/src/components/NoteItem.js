import React, { useState } from 'react';

const NoteItem = ({ note, updateNote, deleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleUpdate = () => {
    const updatedNote = { ...note, title, content };
    updateNote(updatedNote);
    setIsEditing(false);
  };

  return (
 <div className="note-item">
  {isEditing ? (
    <>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}         
        placeholder="Note title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </>
  ) : (
    <>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => deleteNote(note.id)}>Delete</button>
    </>
  )}
 </div>
  );
};

export default NoteItem;
