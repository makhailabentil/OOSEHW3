# DevNotes

A minimalist note-taking application designed specifically for developers to capture and organize their technical learnings, code snippets, and development notes. Built with Next.js and MongoDB, DevNotes offers a clean interface for creating and viewing notes with automatic timestamp tracking.

## Installing / Getting started

To run DevNotes locally, you'll need Node.js (v18 or higher), npm, and a MongoDB Atlas account.

```shell
# Clone the repository
git clone [your-repo-url]
cd devnotes

# Install dependencies
npm install

# Create .env.local and add your MongoDB URI
echo "MONGODB_URI=your_mongodb_connection_string" > .env.local

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Developing

### Prerequisites
1. Install Node.js (v18+) from [nodejs.org](https://nodejs.org/)
2. Create a free [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
3. Set up a MongoDB cluster and get your connection string

### Development Environment Setup
```shell
# Clone the repository
git clone [your-repo-url]
cd devnotes

# Install dependencies
npm install

# Create and edit .env.local
echo "MONGODB_URI=your_mongodb_connection_string" > .env.local

# Start development server with hot reload
npm run dev

# Run linting
npm run lint
```

### Database Configuration
1. Create a MongoDB Atlas cluster
2. Add your IP address to the allowlist in Network Access
3. Create a database user in Database Access
4. Get your connection string from the Connect button
5. Replace `your_mongodb_connection_string` in `.env.local`

### Project Structure
```
devnotes/
├── components/          # React components
│   ├── NoteForm.js     # Form for creating notes
│   └── NoteList.js     # Display list of notes
├── lib/
│   └── dbConnect.js    # MongoDB connection utility
├── models/
│   └── Note.js         # Mongoose Note model
├── pages/
│   ├── api/
│   │   └── notes.js    # API endpoints for notes
│   └── index.js        # Main application page
└── styles/
    └── globals.css     # Global styles and Tailwind imports
```

### Dependencies
- **Frontend**: Next.js 15.1.6, React 19.0.0
- **Database**: MongoDB 6.12.0, Mongoose 8.9.5
- **Styling**: Tailwind CSS 3.4.1, @tailwindcss/forms 0.5.10
- **Date Formatting**: date-fns 4.1.0

### API Endpoints
- `GET /api/notes` - Retrieve all notes
- `POST /api/notes` - Create a new note

### Database Schema
```javascript
Note {
  title: String,      // Required
  content: String,    // Required
  createdAt: Date,    // Auto-generated
  updatedAt: Date     // Auto-updated
}
```

### Building and Deployment
```shell
# Create production build
npm run build

# Start production server
npm start
```

### Code Style
- Uses ESLint with Next.js configuration
- Run `npm run lint` to check code style
- Prettier is recommended for code formatting

### Testing
Currently, the project doesn't include automated tests. This is planned for future iterations.

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

### Future Improvements
- User authentication
- Note search functionality
- Edit and delete capabilities
- Markdown support
- Tags and categories
- Dark mode toggle

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request