# Notes Assistant - AI-Powered Study Platform

A modern study notes application that transforms your PDFs and text documents into interactive learning materials using AI. Generate summaries, flashcards, quizzes, and action items from your study materials.

## About This Project

This AI-powered study platform was developed to demonstrate the integration of modern web technologies with artificial intelligence for educational purposes. The project exists in two implementations: the main branch features a traditional MERN stack architecture, while the Next.js version was specifically created to leverage Vercel's seamless MongoDB integration for easier deployment and hosting.

## Project Versions

### Main Branch - MERN Stack
The original implementation using the traditional MERN (MongoDB, Express, React, Node.js) stack with separate frontend and backend applications.

### Next.js Version - Full-Stack Framework
A refactored version built with Next.js that combines frontend and backend into a single application, optimized for Vercel deployment with better MongoDB integration.

## Features

- **Document Processing**: Upload and process PDFs and text documents
- **AI-Powered Analysis**: Automatically generate study materials using advanced AI
- **Smart Summaries**: Get concise, intelligent summaries of your documents
- **Interactive Flashcards**: Create and study with AI-generated flashcards
- **Adaptive Quizzes**: Test your knowledge with contextual questions
- **Action Items**: Extract actionable tasks and next steps from content
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Seamless experience across all devices
- **Note Management**: Organize and manage your study materials

## Tech Stack

### Main Branch (MERN)
**Frontend**
- React 18
- React Router
- Native Fetch API for HTTP requests
- CSS Modules

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Next.js Version
**Frontend & Backend**
- Next.js 15
- React 18
- Next.js API Routes
- MongoDB with Mongoose
- Lucide React (Icons)
- React Markdown
- CSS Modules

### Shared Technologies
- **Database**: MongoDB
- **AI Integration**: Custom AI Service
- **File Processing**: PDF parsing and text extraction
- **Authentication**: JWT tokens

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Database
- npm or yarn package manager
- AI Service API Keys

### Main Branch Setup (MERN)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/notes-assistant.git
   cd notes-assistant
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Environment Variables:

   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Server
   PORT=5000
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # AI Service
   AI_API_KEY=your_ai_api_key
   AI_SERVICE_URL=your_ai_service_endpoint
   ```

   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the development servers:
   ```bash
   # Start backend
   npm run dev
   
   # In another terminal, start frontend
   cd frontend
   npm start
   ```

### Next.js Version Setup

1. Switch to the Next.js branch:
   ```bash
   git checkout nextjs-version
   cd nextjs-version
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:

   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # AI Service
   AI_API_KEY=your_ai_api_key
   AI_SERVICE_URL=your_ai_service_endpoint
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

### Main Branch (MERN)
```
notes-assistant/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── .env                     # Backend environment variables
└── package.json             # Backend dependencies
```

### Next.js Version
```
nextjs-version/
├── components/              # React components
│   ├── common/             # Shared components
│   ├── form/               # Form components
│   └── layout/             # Layout components
├── context/                # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Library configurations
├── middleware/             # Custom middleware
├── models/                 # Database models
├── pages/                  # Next.js pages and API routes
│   ├── api/               # API endpoints
│   ├── app/               # Main application pages
│   ├── auth/              # Authentication pages
│   └── study-notes/       # Dynamic note routes
├── public/                 # Static assets
├── services/              # External service integrations
├── styles/                # CSS stylesheets
├── utils/                 # Utility functions
├── .env                   # Environment variables
├── next.config.mjs       # Next.js configuration
└── package.json          # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `POST /api/users/change-password` - Update password
- `DELETE /api/users/delete` - Delete user account

### Notes Management
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note with AI processing
- `GET /api/notes/:id` - Get specific note details
- `PUT /api/notes/:id` - Update note content
- `DELETE /api/notes/:id` - Delete note

### Study Materials
- AI-generated summaries, flashcards, quizzes, and action items are included in note responses

## Usage

1. **Sign up** for a new account or **log in** to your existing account
2. **Upload** a PDF or text document from your dashboard
3. **Wait** for AI processing to analyze your document
4. **Review** the generated summary, flashcards, quiz questions, and action items
5. **Study** using the interactive flashcard and quiz systems
6. **Manage** your notes library and track your learning progress

## Deployment

### Main Branch (MERN Stack)

**Frontend Deployment** (Vercel/Netlify):
```bash
cd client
npm run build
```

**Backend Deployment** (Railway/Heroku/Render):
```bash
# Set environment variables in your hosting platform
git subtree push --prefix=backend heroku main
```

### Next.js Version (Recommended)

**Vercel Deployment** (Optimized for MongoDB integration):

1. Connect your GitHub repository to Vercel
2. Select the `nextjs-version` directory as the root
3. Configure environment variables in Vercel dashboard
4. Deploy with automatic MongoDB Atlas integration

```bash
# Or deploy manually
cd nextjs-version
npm run build
```

**Why Next.js for Deployment?**
The Next.js version was specifically created to take advantage of Vercel's seamless MongoDB integration, serverless functions, and simplified deployment process. This eliminates the need to manage separate frontend and backend deployments while providing better performance and easier maintenance.

## Environment Configuration

Make sure to set all environment variables in your production environment:
- Database connection strings
- AI service API keys
- JWT secrets
- File upload configurations

## Future Improvements
- [ ] Add collaborative study groups
- [ ] Implement spaced repetition algorithms
- [ ] Add progress tracking and analytics
- [ ] Create mobile application
- [ ] Add support for more file formats
- [ ] Implement offline study mode
- [ ] Add study session timers
- [ ] Create shareable study materials

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Note**: Please specify which version (MERN or Next.js) your contribution targets.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/) - JavaScript library for building UIs
- [Next.js](https://nextjs.org/) - React framework for production
- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Vercel](https://vercel.com/) - Deployment platform with MongoDB integration
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
