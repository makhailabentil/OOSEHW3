import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user?.photoURL);

  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    }
    console.log('User photo URL:', user?.photoURL); // Debug log
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-1 hover:opacity-80 transition-opacity"
        title={user?.displayName || 'User'}
      >
        <img 
          src={profileImage || '/default-avatar.png'} // Add a default avatar
          alt={user?.displayName || 'User avatar'} 
          className="w-8 h-8 rounded-full border-2 border-[#27f7f7] hover:border-[#3afafa] transition-colors"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
            console.log('Failed to load profile image'); // Debug log
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 console-box p-4 z-50 profile-dropdown">
          <div className="mb-4">
            <p className="text-[#27f7f7] mb-1">{'>'} PROFILE_</p>
            <p className="text-[#27f7f7]">{user.displayName}</p>
            <p className="text-sm opacity-70">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="console-button w-full text-left"
          >
            {'>'} LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}