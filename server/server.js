import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
credentials: true // Allow credentials if needed
}));

app.use(express.json());//allow us to accept json data in the req.body


console.log(process.env.MONGODB_URI);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);

});