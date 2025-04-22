import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import courseInquiryRoutes from './routes/courseInquiryRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/course-inquiries', courseInquiryRoutes);

// Guest enrollment endpoints
app.post('/api/enrollment/guest-enrollment', async (req, res) => {
  try {
    const { courseId, courseName, coursePrice, name, email, phone } = req.body;
    
    // Create record in course_cop collection
    const enrollment = await mongoose.connection.collection('course_cop').insertOne({
      courseId,
      courseName,
      coursePrice,
      userName: name,
      userEmail: email,
      userPhone: phone,
      enrollmentDate: new Date(),
      paymentStatus: 'pending'
    });
    
    res.status(201).json({ success: true, enrollmentId: enrollment.insertedId });
  } catch (error) {
    console.error('Error saving enrollment information:', error);
    res.status(500).json({ success: false, message: 'Failed to save enrollment information' });
  }
});

// Update payment status endpoint
app.post('/api/enrollment/update-payment-status', async (req, res) => {
  try {
    const { email, courseId, paymentStatus } = req.body;
    
    await mongoose.connection.collection('course_cop').updateOne(
      { userEmail: email, courseId: courseId },
      { $set: { paymentStatus: paymentStatus } }
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const clientBuildPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  // For any route that is not an API route, serve the index.html
  app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
      res.sendFile(path.resolve(clientBuildPath, 'index.html'));
    }
  });
  
  console.log('Running in production mode, serving static files');
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});