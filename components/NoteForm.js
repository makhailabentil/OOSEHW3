import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill and configure modules
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    const { default: ImageResize } = await import('quill-image-resize-module-react');

    // Import Quill and Parchment safely
    const Quill = (await import('quill')).default;
    const Parchment = Quill.import('parchment');

    // Register image resize module
    Quill.register('modules/imageResize', ImageResize);

    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image']
      ],
      imageResize: {
        parchment: Parchment,
        modules: ['Resize', 'DisplaySize']
      }
    };

    return function QuillEditor({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} modules={modules} {...props} />;
    };
  },
  { ssr: false }
);

export default function NoteForm({ onSubmit, user, initialData }) {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [content, setContent] = useState(initialData ? initialData.content : '');
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      // Make sure we're using the correct endpoint
      const url = initialData 
        ? `/api/notes/${initialData._id}`  // For editing existing notes
        : '/api/notes';                    // For creating new notes
      
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.uid}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      onSubmit && onSubmit(data);
      
      if (!initialData) {
        setTitle('');
        setContent('');
      }
      setError(null);
    } catch (error) {
      console.error('Error saving note:', error);
      setError(`Failed to save note: ${error.message}`);
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
          <label className="block text-sm mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="console-input"
            placeholder="Enter title..."
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Content</label>
          <div className="editor-wrapper">
            <ReactQuill
              forwardedRef={quillRef}
              value={content}
              onChange={setContent}
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
