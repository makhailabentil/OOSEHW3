import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    
    // Custom file upload handler
    function fileHandler() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '.pdf,.doc,.docx,.txt,.md'); // Add more file types as needed
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (response.ok) {
              const data = await response.json();
              const range = this.quill.getSelection(true);
              
              // Insert a link to the uploaded file
              this.quill.insertText(range.index, `📎 ${file.name} `, 'bold');
              this.quill.insertText(range.index + file.name.length + 2, ' ');
              this.quill.formatText(range.index, file.name.length + 2, 'link', data.url);
            } else {
              console.error('Upload failed');
            }
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      };
    }

    // Register custom handler
    const icons = RQ.Quill.import('ui/icons');
    icons['file'] = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.5,6H12V3.5A1.5,1.5,0,0,0,10.5,2h-4A1.5,1.5,0,0,0,5,3.5V6H1.5A1.5,1.5,0,0,0,0,7.5v7A1.5,1.5,0,0,0,1.5,16h15A1.5,1.5,0,0,0,18,14.5v-7A1.5,1.5,0,0,0,16.5,6ZM6,3.5A.5.5,0,0,1,6.5,3h4a.5.5,0,0,1,.5.5V6H6Zm11,11a.5.5,0,0,1-.5.5H1.5a.5.5,0,0,1-.5-.5v-7A.5.5,0,0,1,1.5,7h15a.5.5,0,0,1,.5.5Z"/></svg>';

    const Module = {
      toolbar: {
        handlers: {
          file: fileHandler
        }
      }
    };

    return function comp({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} modules={Module} {...props} />;
    };
  },
  { ssr: false }
);

export default function NoteForm({ onSubmit, user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'file'],  // Add file button here
        ['clean']
      ],
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const data = await res.json();
      onSubmit && onSubmit(data);
      
      setTitle('');
      setContent('');
      setError(null);
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="console-box space-y-6">
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {"> ERROR_"} {error}
          </div>
        )}
        <div>
          <label className="block text-sm mb-2">
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="console-input"
            placeholder="Enter title..."
          />
        </div>
        <div>
          <label className="block text-sm mb-2">
          </label>
          <div className="editor-wrapper">
            <ReactQuill
              forwardedRef={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              placeholder="Enter content..."
              className="console-editor"
            />
          </div>
        </div>
        <button type="submit" className="console-button mt-4">
          {"> SAVE_NOTE"}
        </button>
      </div>
    </form>
  );
}