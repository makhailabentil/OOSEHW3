import { format } from 'date-fns';
import { useState } from 'react';

export default function NoteList({ notes }) {
  const [selectedNote, setSelectedNote] = useState(null);

  // Function to clean HTML tags for preview
  const cleanContent = (html) => {
    // Remove HTML tags but preserve line breaks
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .trim();
  };

  if (!notes?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="console-box">
          <p className="text-center">{'>'} NO_NOTES_FOUND_</p>
        </div>
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="console-box">
          <button 
            onClick={() => setSelectedNote(null)}
            className="console-button mb-4"
          >
            {'<'} BACK
          </button>
          <h2 className="text-2xl mb-4">{'>'} {selectedNote.title}_</h2>
          <div 
            className="mt-4 opacity-90 note-content" 
            dangerouslySetInnerHTML={{ __html: selectedNote.content }}
          />
          <p className="mt-6 text-sm opacity-70">
            {'>'} CREATED_{format(new Date(selectedNote.createdAt), 'MMM-dd-yyyy_hh:mm:ss_aa')}_ 
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="console-box">
        <h2 className="text-lg mb-6">{'>'} SAVED_NOTES </h2>
        <div className="space-y-4">
          {notes.map((note) => (
            <div 
              key={note._id} 
              className="note-card cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setSelectedNote(note)}
            >
              <h3 className="text-lg">{'>'} {note.title}_</h3>
              <p className="mt-2 opacity-90 line-clamp-2">
                {cleanContent(note.content)}
              </p>
              <p className="mt-2 text-sm opacity-70">
                {'>'} Posted: {format(new Date(note.createdAt), 'MMM-dd-yyyy_hh:mm:ss_aa')} 
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}