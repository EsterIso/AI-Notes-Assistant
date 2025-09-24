# Notes Assistant - AI-Powered Study Platform

A modern study notes application that transforms your PDFs, text documents, and various file formats into interactive learning materials using AI. Generate summaries, flashcards, quizzes, and action items from your study materials.

## About This Project

This AI-powered study platform demonstrates the integration of modern web technologies with artificial intelligence for educational purposes. Built with Next.js for optimal deployment on Vercel with seamless MongoDB integration, featuring comprehensive Python-based test automation.

## Project Architecture

### Main Branch - Next.js Full-Stack Application
The primary implementation uses Next.js 15 for a unified full-stack architecture, optimized for Vercel deployment with integrated MongoDB support and comprehensive Python test automation.

### Legacy Branch - MERN Stack (`main-mern`)
The original implementation using traditional MERN (MongoDB, Express, React, Node.js) stack with separate frontend and backend applications.

## Features

- **Multi-Format Document Processing**: Upload and process PDFs, DOCX, text, and Markdown files
- **Email Verification**: Secure account verification system
- **AI-Powered Analysis**: Automatically generate study materials using advanced AI
- **Smart Summaries**: Get concise, intelligent summaries of your documents
- **Interactive Flashcards**: Create and study with AI-generated flashcards
- **Adaptive Quizzes**: Test your knowledge with contextual questions
- **Action Items**: Extract actionable tasks and next steps from content
- **User Authentication**: Secure JWT-based authentication with email verification
- **Responsive Design**: Seamless experience across all devices
- **Note Management**: Organize and manage your study materials
- **Comprehensive Testing**: Python-based test automation suite

## Tech Stack

### Frontend & Backend
- **Next.js 15** - React framework with API routes
- **React 18** - User interface library
- **MongoDB with Mongoose** - Database and ODM
- **Lucide React** - Modern icon library
- **React Markdown** - Markdown rendering
- **JWT Authentication** - Secure token-based auth
- **File Processing** - Support for PDF, DOCX, TXT, and MD files

### Testing & QA
- **Python + Selenium** - End-to-end browser automation
- **pytest** - Testing framework
- **requests** - API testing
- **pymongo** - Database testing

### AI Integration
- Custom AI Service for content analysis
- Document parsing and text extraction
- Intelligent content generation

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+ (for testing)
- MongoDB Database
- npm or yarn package manager
- AI Service API Keys

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EsterIso/AI-Meeting---Notes-Assistant.git
   cd AI-Meeting---Notes-Assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Python testing environment:**
   ```bash
   pip install -r tests/requirements.txt
   ```

4. **Environment Variables:**

   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Email Service (Gmail App Password recommended)
   EMAIL_USER=your_app_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   
   # AI Service
   OPENAI_API_KEY=your_openai_api_key
   
   # App Configuration
   NEXT_PUBLIC_API_URL=/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   COMPANY_NAME=StudyAI
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Run tests:**
   ```bash
   # API tests
   pytest tests/test_api.py
   
   # End-to-end tests
   pytest tests/test_e2e.py
   
   # All tests
   pytest tests/
   ```

## Project Structure

```
notes-assistant/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── common/           # Shared components
│   ├── form/             # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── db.js            # Database connection
│   ├── auth.js          # Authentication logic
│   └── utils.js         # Helper functions
├── models/               # MongoDB models
├── services/             # External integrations
├── tests/                # Python test suite
│   ├── test_api.py      # API endpoint tests
│   ├── test_e2e.py      # Selenium browser tests
│   ├── test_integration.py # Integration tests
│   ├── requirements.txt  # Python dependencies
│   └── pytest.ini       # Test configuration
├── public/               # Static assets
├── styles/               # CSS modules
├── .env.local           # Environment variables
├── next.config.mjs      # Next.js configuration
└── package.json         # Node.js dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - User authentication
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Update password
- `DELETE /api/auth/delete` - Delete user account

### Notes Management
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note with AI processing
- `GET /api/notes/[id]` - Get specific note details
- `PUT /api/notes/[id]` - Update note content
- `DELETE /api/notes/[id]` - Delete note

### File Upload
- `POST /api/upload` - Upload PDF, DOCX, TXT, or MD files

## Testing

### Test Automation Suite
This project includes comprehensive Python-based testing:

**API Testing:**
- Endpoint functionality testing
- Authentication flow testing
- Data validation testing
- Error handling verification

**End-to-End Testing:**
- User registration and login flows
- File upload and processing
- Study material generation
- Interactive flashcard and quiz systems

**Integration Testing:**
- Frontend-backend integration
- Database operations
- AI service integration

**Run specific test suites:**
```bash
# API tests only
pytest tests/test_api.py -v

# UI tests only
pytest tests/test_e2e.py -v

# Tests with coverage
pytest tests/ --cov=app
```

## Usage

1. **Sign up** for a new account and verify your email
2. **Upload** supported files (PDF, DOCX, TXT, MD) from your dashboard
3. **Wait** for AI processing to analyze your document
4. **Review** the generated summary, flashcards, quiz questions, and action items
5. **Study** using the interactive flashcard and quiz systems
6. **Manage** your notes library and track your learning progress

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables in Vercel dashboard**
3. **Deploy automatically on every push to main**

```bash
# Or deploy manually
npm run build
vercel deploy
```

**Why Next.js + Vercel?**
- Seamless MongoDB integration
- Serverless functions for API routes
- Automatic deployments
- Global CDN for optimal performance
- No separate backend hosting required

### Environment Variables for Production
Configure these environment variables in your Vercel dashboard:
- **MONGODB_URI** - Your MongoDB Atlas connection string
- **JWT_SECRET** - Secret key for JWT token signing
- **OPENAI_API_KEY** - OpenAI API key for AI content generation
- **EMAIL_USER** - Gmail address for sending emails (e.g., studyai.noreply@gmail.com)
- **EMAIL_PASSWORD** - Gmail App Password (not your regular Gmail password)
- **COMPANY_NAME** - Your application name (e.g., StudyAI)
- **NEXT_PUBLIC_API_URL** - API endpoint path (use `/api` for Next.js)
- **FRONTEND_URL** - Your production domain URL

## Quality Assurance

This project demonstrates professional QA practices:
- **Cross-language testing** (Python testing Node.js/React app)
- **Multiple testing levels** (unit, integration, e2e)
- **CI/CD ready** test automation
- **Industry-standard tools** (pytest, Selenium, requests)

Perfect for showcasing both **development** and **QA engineering** skills.

## Future Improvements
- [ ] Advanced spaced repetition algorithms
- [ ] Collaborative study groups
- [ ] Progress analytics dashboard
- [ ] Mobile application (React Native)
- [ ] Additional file format support
- [ ] Offline study mode
- [ ] Study session analytics
- [ ] Social sharing features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your feature
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building UIs
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Vercel](https://vercel.com/) - Deployment platform
- [Python](https://python.org/) - Testing automation language
- [Selenium](https://selenium.dev/) - Web browser automation
- [pytest](https://pytest.org/) - Testing framework
