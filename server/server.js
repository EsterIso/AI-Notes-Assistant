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
    origin: 'http://localhost:5173', 
credentials: true 
}));

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/notes', notesRoutes)

console.log(process.env.MONGODB_URI);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);

});