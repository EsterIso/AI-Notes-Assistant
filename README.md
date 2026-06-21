# Notes Assistant - AI-Powered Study Platform

A modern study notes application that transforms your PDFs, text documents, and various file formats into interactive learning materials using AI. Generate summaries, flashcards, quizzes, and action items from your study materials.

## About This Project

This AI-powered study platform demonstrates the integration of modern web technologies with artificial intelligence for educational purposes. Built with Next.js for optimal deployment on Vercel with seamless MongoDB integration and Clerk-managed authentication.

## Project Architecture

### Main Branch - Next.js Full-Stack Application
The primary implementation lives in [`nextjs-version/`](nextjs-version/) and uses Next.js 15 with the **Pages Router** (`pages/`, not `app/`) for a unified full-stack architecture, optimized for Vercel deployment with integrated MongoDB support.

### Legacy Branch - MERN Stack (`main-mern`)
The original implementation using traditional MERN (MongoDB, Express, React, Node.js) stack with separate frontend and backend applications.

## Features

- **Multi-Format Document Processing**: Upload and process PDFs, DOCX, text, and Markdown files
- **Managed Authentication**: Sign-up/sign-in handled by [Clerk](https://clerk.com)
- **AI-Powered Analysis**: Automatically generate study materials using advanced AI
- **Smart Summaries**: Get concise, intelligent summaries of your documents
- **Interactive Flashcards**: Create and study with AI-generated flashcards
- **Adaptive Quizzes**: Test your knowledge with contextual questions
- **Action Items**: Extract actionable tasks and next steps from content
- **Responsive Design**: Seamless experience across all devices
- **Note Management**: Organize and manage your study materials

## Tech Stack

### Frontend & Backend
- **Next.js 15** (Pages Router) - React framework with API routes
- **React 19** - User interface library
- **Clerk** - Authentication, session management, and account management UI
- **MongoDB with Mongoose** - Database and ODM (stores notes + a small per-user subscription/plan record keyed by Clerk user ID)
- **Lucide React** - Modern icon library
- **React Markdown** - Markdown rendering
- **File Processing** - Support for PDF, DOCX, TXT, and MD files (`pdf-parse`, `mammoth`)

### AI Integration
- OpenAI-backed content analysis service
- Document parsing and text extraction
- Intelligent content generation

### Testing & QA
- **Selenium + pytest** - Browser automation for the signup flow (`tests/test_e2e.py`)

> **Known gap:** `tests/test_e2e.py` currently drives the old custom signup form (it clicks a `.sign-up` CSS class) and points at a pre-Clerk deployment. It needs to be rewritten against Clerk's hosted `<SignUp/>` UI before it's useful again. There is currently no API-level or integration-level automated test suite in this repo, despite earlier docs implying otherwise.

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Database
- npm or yarn package manager
- A [Clerk](https://dashboard.clerk.com) application (free tier is fine)
- OpenAI API key

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EsterIso/AI-Meeting---Notes-Assistant.git
   cd AI-Meeting---Notes-Assistant/nextjs-version
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env.local` file inside `nextjs-version/`:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Clerk Authentication (from your Clerk Dashboard → API Keys)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

   # AI Service
   OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   NEXT_PUBLIC_API_URL=/api
   FRONTEND_URL=http://localhost:3000
   ```

   In your Clerk Dashboard, enable **Email address + Password** under *User & Authentication*, and set the Sign-in/Sign-up paths to `/login`/`/signup` under *Paths*.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run the e2e test (optional, currently out of date — see Known gap above):**
   ```bash
   pip install -r ../tests/requirements.txt
   pytest ../tests/test_e2e.py
   ```

## Project Structure

```
nextjs-version/
├── middleware.js          # Clerk route protection (clerkMiddleware)
├── pages/
│   ├── api/
│   │   ├── notes/         # Notes CRUD (auth via Clerk getAuth())
│   │   └── users/delete.js # Account deletion (Mongo + Clerk user removal)
│   ├── login/[[...index]].js   # Clerk <SignIn/> catch-all route
│   ├── signup/[[...index]].js  # Clerk <SignUp/> catch-all route
│   ├── app/                # Dashboard/Settings/StudyNotes components
│   ├── public/              # Public-facing HomePage component
│   ├── dashboard.js, settings.js, index.js  # Top-level routes
│   └── study-notes/        # Study notes routes
├── components/
│   ├── common/
│   └── layout/             # AppLayout, AuthHeader, Sidebar, etc.
├── models/                 # Mongoose models (User, Note, Flashcard, QuizQuestion)
├── services/                # ai/pdf/docx/note client + AI services
├── utils/                   # notes.controller.js, getOrCreateUser.js
├── lib/mongodb.js           # Database connection
├── public/                  # Static assets
├── styles/                  # CSS modules
├── .env.local               # Environment variables
├── next.config.mjs
└── package.json
```

## API Endpoints

Sign-up, sign-in, password reset, and session management are handled entirely by Clerk's hosted components (`/login`, `/signup`) — there are no custom `/api/users/register`, `/login`, or email-verification endpoints in this app.

### Account
- `DELETE /api/users/delete` - Delete the signed-in user's Clerk account and all associated Mongo data (notes, subscription record)

### Notes Management
- `GET /api/notes` - Get all notes for the signed-in user
- `POST /api/notes` - Create new note with AI processing
- `GET /api/notes/[id]` - Get specific note details
- `PUT /api/notes/[id]` - Update note content
- `DELETE /api/notes/[id]` - Delete note

All notes endpoints require a valid Clerk session (enforced both by `middleware.js` and by `getAuth()` inside each route handler).

## Usage

1. **Sign up** for a new account via Clerk's hosted sign-up flow
2. **Upload** supported files (PDF, DOCX, TXT, MD) from your dashboard
3. **Wait** for AI processing to analyze your document
4. **Review** the generated summary, flashcards, quiz questions, and action items
5. **Study** using the interactive flashcard and quiz systems
6. **Manage** your notes library and track your learning progress

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect your GitHub repository to Vercel**, with the project root set to `nextjs-version/`
2. **Configure environment variables in Vercel dashboard**
3. **Deploy automatically on every push to main**

```bash
# Or deploy manually
cd nextjs-version
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
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** / **CLERK_SECRET_KEY** - From your Clerk Dashboard (use your production Clerk instance keys, not test keys)
- **NEXT_PUBLIC_CLERK_SIGN_IN_URL** / **NEXT_PUBLIC_CLERK_SIGN_UP_URL** - `/login` and `/signup`
- **NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL** / **NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL** - `/dashboard`
- **OPENAI_API_KEY** - OpenAI API key for AI content generation
- **NEXT_PUBLIC_API_URL** - API endpoint path (use `/api` for Next.js)
- **FRONTEND_URL** - Your production domain URL

## Future Improvements
- [ ] Stripe billing integration for paid plans (subscription schema already in place on the User model)
- [ ] Rewrite `tests/test_e2e.py` against the Clerk-based auth flow; add API-level test coverage
- [ ] Collaborative study groups
- [ ] Progress analytics dashboard
- [ ] Mobile application (React Native)
- [ ] Additional file format support
- [ ] Offline study mode
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
- [Clerk](https://clerk.com/) - Authentication and user management
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Vercel](https://vercel.com/) - Deployment platform
- [Selenium](https://selenium.dev/) - Web browser automation
- [pytest](https://pytest.org/) - Testing framework
