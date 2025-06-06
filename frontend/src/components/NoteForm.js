import React, { useState } from 'react';

const NoteForm = ({ addNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);

    try {
      await addNote({
        title: title.trim(),
        content: content.trim()
      });

      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h2>Create a New Note</h2>

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note content"
          rows="4"
          disabled={isSubmitting}
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim() || !content.trim()}
      >
        {isSubmitting ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
};

export default NoteForm;
