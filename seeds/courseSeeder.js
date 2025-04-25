import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect("mongodb+srv://sundarinfoziant:ceahzJvShvxIE3tM@infoziant.byupx6p.mongodb.net/?retryWrites=true&w=majority&appName=infoziant")
  .then(() => console.log('MongoDB connected for seeding data'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample courses data
const coursesData = [
  {
    title: 'AI & Machine Learning Internship Program',
    description: 'Comprehensive internship program covering Python for Data Science, machine learning models, and practical applications with mini-project deployment.',
    image: 'https://plus.unsplash.com/premium_photo-1682124651258-410b25fa9dc0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFjaGluZSUyMGxlYXJuaW5nfGVufDB8fDB8fHww?w=800&auto=format&fit=crop',
    instructor: 'AICL Infoziant Team',
    price: 1499,
    duration: '15 days',
    level: 'Begineer - Intermediate',
    topics: [
      'Python for Data Science',
      'Exploratory Data Analysis (EDA)',
      'Supervised Learning Models',
      'Linear Regression',
      'Logistic Regression',
      'Tree Models',
      'Bagging and Boosting',
      'Unsupervised Learning Models',
      'Clustering and Neural Networks',
      'PCA'
    ],
    rating: 4.8,
    enrollmentCount: 1256,
    featured: true,
    
  },
  {
    title: 'Cyber Security Internship',
    description: 'Hands-on session with live experience in cybersecurity. You can also get a job opportunity after the internship!',
    image: 'https://images.unsplash.com/photo-1614064642578-7faacdc6336e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGN5YmVyfGVufDB8fDB8fHww?w=800&auto=format&fit=crop',
    instructor: 'AICL Infoziant Team',
    price: 1499,
    duration: '15 days',  
    level: 'Beginner to Intermediate',
    topics: [
      'Introduction',
      'Ethical Hacking',
      'VAPT - Web Application',
      'Bug Bounty',
      'Email Security', 
      'Malware Analysis',
      'Tools Used: Burpsuite & Ollydbg'
    ],
    rating: 4.7,
    enrollmentCount: 983,
    featured: true,
    
  },
  {
    title: 'Web Development Internship',
    description: 'Live session with mini-project deployment. Learn full-stack web development from basics to advanced concepts.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop',
    instructor: 'AICL Infoziant Team',
    price: 1499,
    duration: '15 days',
    level: 'Beginner to Intermediate',
    topics: [
      'Introduction to Web Development',
      'HTML, CSS',
      'Javascript Version Control with Git',
      'Backend Dev - Python',
      'PHP, Node',
      'DB - MongoDB',
      'Framework - React.js'
    ],
    rating: 4.9,
    enrollmentCount: 1475,
    featured: true,
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    console.log('Courses collection cleared');
    
    // Add courses
    const courses = await Course.insertMany(coursesData);
    console.log(`${courses.length} courses added successfully`);
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Create admin user
      const newAdmin = await User.create({
        ...adminUser,
        password: hashedPassword
      });
      
      console.log(`Admin user created: ${newAdmin.email}`);
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 