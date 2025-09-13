import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import notesRoutes from './routes/notes.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '100mb' }));

app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
credentials: true // Allow credentials if needed
}));

app.use(express.json());//allow us to accept json data in the req.body

app.use('/api/users', userRoutes);

app.use('/api/notes', notesRoutes)

console.log(process.env.MONGODB_URI);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);

});