import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

export default function Home() {
  const { user, login, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNote = async (note) => {
    try {
      await fetchNotes();
    } catch (error) {
      console.error('Error handling new note:', error);
    }
  };

  return (
    <div className="notebook-background">
      <Head>
        <title>DevNotes_Console</title>
        <meta name="description" content="A Tron-inspired note-taking app" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>

      <div className="cyber-paper">
        <div className="spiral-binding"></div>
        <div className="margin-line"></div>
        <div className="cyber-content">
          <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl text-center text-[#27f7f7]">
                {"DevNotes"}
              </h1>
              {user && (
                <button onClick={logout} className="console-button">
                  {'>'} LOGOUT
                </button>
              )}
            </div>

            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-2xl mb-6 text-[#27f7f7]">{'>'} ACCESS_REQUIRED</h2>
                <button onClick={login} className="console-button">
                  {'>'} LOGIN_WITH_GOOGLE
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="text-red-500 text-center mb-4">
                    {error}
                  </div>
                )}
                <div className="mb-8">
                  <NoteForm onSubmit={handleNewNote} />
                </div>
                <div className="max-w-lg mx-auto border-t border-gray-200 my-8"></div>
                <NoteList notes={notes} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}