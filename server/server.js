import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sportRoutes from './routes/sportRoutes.js';
import classRoutes from './routes/classRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import authLogRoutes from './routes/authLogRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(readFileSync(join(__dirname, 'swagger.json'), 'utf8'));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/students', studentRoutes);
app.use('/coaches', coachRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/sports', sportRoutes);
app.use('/classes', classRoutes);
app.use('/financial', financialRoutes);
app.use('/auth-logs', authLogRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/*   // TO:DO add Error handling middleware 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
  */



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
});