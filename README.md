# DevNotes

A minimalist note-taking application designed specifically for developers to capture and organize their technical learnings, code snippets, and development notes. Built with Next.js, Firebase Authentication, and MongoDB, DevNotes offers a clean interface with a Tron-inspired design.

## Tech Stack

- **Frontend**: 
  - Next.js 15.1.6
  - React 18.2.0
  - React Quill (Rich Text Editor)
  - TailwindCSS 3.4.1

- **Backend**: 
  - Next.js API Routes
  - MongoDB with Mongoose
  - Firebase Authentication

- **Authentication**:
  - Firebase Auth with Google Sign-in
  - JWT-based API authorization

- **Database**:
  - MongoDB Atlas
  - Mongoose ODM

## Installing / Getting started

### Prerequisites
1. Node.js (v18+)
2. MongoDB Atlas account
3. Firebase project credentials

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```shell
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Installation Steps

```shell
# Clone the repository
git clone [your-repo-url]
cd devnotes

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Authentication Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Google Authentication in Firebase Auth settings
3. Add your domain to authorized domains
4. Copy your Firebase config to `.env.local`
5. Test authentication by clicking the "LOGIN_WITH_GOOGLE" button

### Database Configuration
1. Create a MongoDB Atlas cluster
2. Add your IP address to the allowlist
3. Create a database user
4. Get your connection string
5. Add the connection string to `.env.local`

## Project Structure
```
devnotes/
├── components/          # React components
├── contexts/           # Auth context
├── lib/               
│   ├── dbConnect.js    # MongoDB connection
│   └── firebase.js     # Firebase configuration
├── models/             # Mongoose models
├── pages/
│   ├── api/           # API endpoints
│   └── index.js       # Main page
└── styles/            # Global styles
```

## Features
- Google Authentication
- Rich Text Editor with image support
- Real-time note creation
- Chronological note listing
- Responsive design
- User-specific notes

## API Endpoints
- `GET /api/notes` - Fetch user's notes (requires authentication)
- `POST /api/notes` - Create new note (requires authentication)

## Database Schema
```javascript
Note {
  title: String,      // Required
  content: String,    // Required
  userId: String,     // Required, from Firebase Auth
  createdAt: Date,    // Auto-generated
  updatedAt: Date     // Auto-updated
}
```

## Additional Development Notes

### Troubleshooting
- If MongoDB connection fails:
  ```shell
  # Verify your connection string
  # Check Network Access in MongoDB Atlas
  # Ensure .env.local is in the root directory
  ```

- For development issues:
  ```shell
  # Clear Next.js cache and node_modules
  rm -rf .next
  rm -rf node_modules
  npm install
  ```