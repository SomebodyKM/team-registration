// Server code
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import participantRouter from './routes/participant.routes';
import schoolRouter from './routes/school.route';
import optionsRouter from './routes/options.routes';

dotenv.config();

// Create server
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Define allowed origins for React/Vite frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter((origin): origin is string => !!origin);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', schoolRouter);
app.use('/participants', participantRouter);
app.use('/options', optionsRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Server is running!');
});

// Connnect MongoDB and start server
const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: 'team_registration' })
  .then(() => {
    console.log('Connected to MongoDB database');

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
