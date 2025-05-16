require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 5000;
const jwtSecretKey = process.env.JWT_SECRET || "your_jwt_secret";


// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swimming School API",
      version: "1.0.0",
      description: "API for managing a swimming school with admin, coaches, and students",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let accounts = [];

// Initialize sample accounts
async function initializeAccounts() {
  const saltRounds = 10;

  const users = [
    { email: "admin@gmail.com", password: "admin", role: "admin", profileImage: "" },
    { name: "Mehmet Cansız", gender: "male", email: "mehmet@gmail.com", password: "123", session: "Football", section: "A", role: "coach", profileImage: "" },
    { name: "Ahmet Çetin", gender: "male", email: "ahmet@gmail.com", password: "123", session: "Football", section: "B", role: "coach", profileImage: "" },
    { name: "Mustafa Öztürk", gender: "male", email: "mustafa@gmail.com", password: "123", session: "Basketbol", section: "A", role: "coach", profileImage: "" },
    { name: "Zeynep Polat", gender: "female", email: "zeynep@gmail.com", password: "123", session: "Volleyball", section: "A", role: "coach", profileImage: "" },

    {
      email: "student@gmail.com", password: "123", session: "Football", section: "A", role: "student",
      firstName: "Mehmet",
      lastName: "Yılmaz",
      birthDate: "2010-05-15",
      gender: "male",
      parentName: "Ali Yılmaz",
      parentPhone: "5551234567",
      notes: "Örnek öğrenci",
      startDate: "2023-09-01",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student2@gmail.com", password: "123", session: "Football", section: "B", role: "student",
      firstName: "Ayşe",
      lastName: "Demir",
      birthDate: "2011-03-20",
      gender: "female",
      parentName: "Fatma Demir",
      parentPhone: "5559876543",
      notes: "Örnek öğrenci 2",
      startDate: "2025-12-25",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student3@gmail.com", password: "123", session: "Basketbol", section: "A", role: "student",
      firstName: "Ali",
      lastName: "Kaya",
      birthDate: "2012-07-10",
      gender: "male",
      parentName: "Veli Kaya",
      parentPhone: "5556543210",
      notes: "Örnek öğrenci 3",
      startDate: "2024-01-15",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student4@gmail.com", password: "123", session: "Volleyball", section: "A", role: "student",
      firstName: "Fatma",
      lastName: "Çelik",
      birthDate: "2013-02-18",
      gender: "female",
      parentName: "Hasan Çelik",
      parentPhone: "5551112233",
      notes: "Örnek öğrenci 4",
      startDate: "2023-10-01",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student5@gmail.com", password: "123", session: "Football", section: "B", role: "student",
      firstName: "Emre",
      lastName: "Öztürk",
      birthDate: "2014-06-25",
      gender: "male",
      parentName: "Ayşe Öztürk",
      parentPhone: "5552223344",
      notes: "Örnek öğrenci 5",
      startDate: "2024-02-15",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student6@gmail.com", password: "123", session: "Basketbol", section: "A", role: "student",
      firstName: "Zeynep",
      lastName: "Kara",
      birthDate: "2015-09-12",
      gender: "female",
      parentName: "Mehmet Kara",
      parentPhone: "5553334455",
      notes: "Örnek öğrenci 6",
      startDate: "2024-05-20",
      performanceNotes: [],
      profileImage: ""
    },
    {
      email: "student7@gmail.com", password: "123", session: "Volleyball", section: "A", role: "student",
      firstName: "Burak",
      lastName: "Yıldız",
      birthDate: "2012-11-30",
      gender: "male",
      parentName: "Selin Yıldız",
      parentPhone: "5554445566",
      notes: "Örnek öğrenci 7",
      startDate: "2025-03-10",
      performanceNotes: [],
      profileImage: ""
    }
  ];

  for (let i = 0; i < users.length; i++) {
    const hashedPassword = await bcrypt.hash(users[i].password, saltRounds);
    accounts.push({
      id: i + 1,
      email: users[i].email,
      password: hashedPassword,
      role: users[i].role,
      profileImage: users[i].profileImage || "",
      passwordChangedAt: new Date(),
      ...(users[i].role === 'coach' && {
        name: users[i].name,
        gender: users[i].gender,
        session: users[i].session,
        section: users[i].section
      }),
      ...(users[i].role === 'student' && {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        birthDate: users[i].birthDate,
        gender: users[i].gender,
        session: users[i].session,
        section: users[i].section,
        parentName: users[i].parentName,
        parentPhone: users[i].parentPhone,
        notes: users[i].notes,
        startDate: users[i].startDate,
        performanceNotes: users[i].performanceNotes || []
      })
    });
  }

  console.log("Initial users created.");
}

// Token verification function
function verifyToken(token, secret) {
  if (!token) {
    throw new Error('No token provided');
  }

  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret);



    const user = accounts.find(u => u.email === decoded.email);
    if (!user) {
      console.log('User not found in accounts:', decoded.email);
      throw new Error('User not found');
    }

    if (user.passwordChangedAt &&
      (new Date(decoded.tokenCreatedAt) < new Date(user.passwordChangedAt))) {
      throw new Error('Password has been changed, please login again');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired:', error.message);
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token:', error.message);
      throw new Error('Invalid token');
    }
    console.log('Token verification error:', error.message);
    throw new Error(error.message || 'Token verification failed');
  }
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];


  console.log(`\n--- AUTH DEBUG ---`);
  console.log(`Request: ${req.method} ${req.originalUrl}`);


  console.log('Token from request:', token); // DEBUGGING 


  try {
    const decoded = verifyToken(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Email and password are required
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Registration failed
 */
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (accounts.some(user => user.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: accounts.length + 1,
      email,
      password: hashedPassword,
      role: 'student',
      firstName: firstName || '',
      lastName: lastName || '',
      passwordChangedAt: new Date(),
      active: false
    };

    accounts.push(newUser);

    const { password: _, ...userData } = newUser;

    const token = jwt.sign(
      { email: newUser.email, role: newUser.role, id: newUser.id, tokenCreatedAt: new Date() },
      jwtSecretKey,
      { expiresIn: '1h' }
    );


    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = accounts.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role, id: user.id, tokenCreatedAt: new Date() },
      jwtSecretKey,
      { expiresIn: '1h' }
    );

    const { password: _, ...userData } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' , error: error.message});
  }
});

/**
 * @swagger
 * /change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Both passwords are required
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.post('/change-password', authenticate, async (req, res) => {
  console.log('change-password endpoint hit'); // DEBUGGING


  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both passwords are required' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: 'New password cannot be the same as current password' });
  }

  const user = accounts.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.active = true;


    user.passwordChangedAt = new Date();


    const token = jwt.sign(
      { email: user.email, role: user.role, id: user.id, tokenCreatedAt: new Date() },
      jwtSecretKey,
      { expiresIn: '1h' }
    );


    const { password: _, ...userData } = user;
    res.json({
      message: 'Password changed successfully',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
app.get('/users', authenticate, (req, res) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const users = accounts.map(user => {
    const { password, ...userData } = user;
    return userData;
  });

  res.json(users);
});

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 */
app.get('/profile', authenticate, (req, res) => {
  const user = accounts.find(u => u.email === req.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management endpoints
 */

/**
 * @swagger
 * /students:
 *   get:
 *     tags: [Students]
 *     summary: Get all students (admin/coach only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       403:
 *         description: Only admin or coach can access this route
 *       404:
 *         description: Coach not found
 *       400:
 *         description: Coach is not assigned to any session or section
 */
app.get('/students', authenticate, (req, res) => {

  const userRole = req.user.role;
  const userEmail = req.user.email;

  if (userRole === 'admin') {
    const students = accounts
      .filter(user => user.role === 'student')
      .map(({ password, ...student }) => student);
    return res.json(students);
  } else if (userRole === 'coach') {
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found.' });
    }
    if (!coach.section || !coach.session) {
      return res.status(400).json({ message: 'Coach is not assigned to any section or session' });
    }
    const studentsInSession = accounts
      .filter(user => user.section === coach.section && user.session === coach.session && user.role === 'student')
      .map(({ password, ...student }) => student);
    return res.json(studentsInSession);
  } else {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID (admin/coach only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student data
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
app.get('/students/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { role, email } = req.user;

  const student = accounts.find(u => u.id === parseInt(id) && u.role === 'student');
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  if (role === 'coach') {
    const coach = accounts.find(u => u.email === email && u.role === 'coach');
    if (!coach || student.section !== coach.section || student.session !== coach.session) {
      return res.status(403).json({ message: 'You can only view students in your session.' });
    }
  } else if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }

  const { password, ...studentData } = student;
  res.json(studentData);
});

/**
 * @swagger
 * /add-student:
 *   post:
 *     tags: [Students]
 *     summary: Add a new student (admin/coach only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               parentName:
 *                 type: string
 *               parentPhone:
 *                 type: string
 *               notes:
 *                 type: string
 *               section:
 *                 type: string
 *              session:
 *                type: string
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - birthDate
 *               - gender
 *               - parentName
 *               - parentPhone
 *     responses:
 *       201:
 *         description: Student added successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized access
 *       409:
 *         description: Student already exists
 *       500:
 *         description: Failed to add student
 */
app.post('/add-student', authenticate, async (req, res) => {
  const { role, id } = req.user;
  const studentData = req.body;


  if (role !== 'admin' && role !== 'coach') {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  // Check if the user is an admin or coach


  const requiredFields = ['email', 'firstName', 'lastName', 'birthDate', 'gender', 'parentName', 'parentPhone'];
  const missingFields = requiredFields.filter(field => !studentData[field]);
  if (missingFields.length > 0 && (role === 'coach' && (!studentData.section || !studentData.session))) {
    return res.status(400).json({
      message: 'Missing required fields',
      missing: missingFields
    });
  }

  if (accounts.some(user => user.email === studentData.email)) {
    return res.status(409).json({ message: 'Student email already exists' });
  }

  try {
    const saltRounds = 10;
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    let assignedSection = studentData.section;
    let assignedSession = studentData.session;


    if (role === 'coach') {
      const coach = accounts.find(u => u.id === id);
      if (coach) {
        assignedSection = coach.section;
        assignedSession = coach.session;
      }

      if (!assignedSection || !assignedSession) {
        return res.status(403).json({ message: 'Coach is not assigned to any section or session' });
      }
    }

    const newStudent = {
      id: accounts.length + 1,
      email: studentData.email,
      password: hashedPassword,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      birthDate: studentData.birthDate,
      gender: studentData.gender,
      role: 'student',
      parentName: studentData.parentName,
      parentPhone: studentData.parentPhone,
      session: assignedSession,
      section: assignedSection,
      performanceNotes: [],
      startDate: studentData.startDate || new Date(),
      active: false,
      passwordChangedAt: new Date()
    };


    accounts.push(newStudent);

    const { password, ...studentResponse } = newStudent;

    res.status(201).json({
      message: 'Student added successfully',
      temporaryPassword: randomPassword,
      student: studentResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add student' });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Update student information (admin/coach only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               section:
 *                 type: string
 *              session:
 *                type: string
 *               parentName:
 *                 type: string
 *               parentPhone:
 *                 type: string
 *               notes:
 *                 type: string
 *               performanceNotes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
app.put('/students/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }


  const userRole = req.user.role;
  const userEmail = req.user.email;

  const studentIndex = accounts.findIndex(u => u.id === parseInt(id) && u.role === 'student');
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  if (userRole === 'coach') {
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach || accounts[studentIndex].section !== coach.section || accounts[studentIndex].session !== coach.session) {
      return res.status(403).json({ message: 'You can only update students in your session.' });
    }
  } else if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Only admin or coach can update student information.' });
  }

  const allowedFields = [
    'firstName', 'lastName', 'birthDate', 'gender', 'section', 'session',
    'startDate', 'session', 'email',
    'parentName', 'parentPhone', 'notes', 'performanceNotes'
  ];

  for (const field in updates) {
    if (allowedFields.includes(field)) {
      accounts[studentIndex][field] = updates[field];
    }
  }

  res.status(200).json({
    message: 'Student updated successfully',
    student: {
      id: accounts[studentIndex].id,
      email: accounts[studentIndex].email,
      firstName: accounts[studentIndex].firstName,
      lastName: accounts[studentIndex].lastName,
      section: accounts[studentIndex].section,
      session: accounts[studentIndex].session,
      birthDate: accounts[studentIndex].birthDate,


    }
  });
});


/**
 * @swagger
 * /coaches/{id}:
 *   put:
 *     tags: [Coaches]
 *     summary: Update coach information (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               section:
 *                 type: string
 *               session:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coach updated successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Coach not found
 */
app.put('/coaches/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const coachIndex = accounts.findIndex(u => u.id === parseInt(id) && u.role === 'coach');
  if (coachIndex === -1) {
    return res.status(404).json({ message: 'Coach not found' });
  }

  const allowedFields = ['name', 'email', 'section', 'session'];
  let hasUpdates = false;

  for (const field in updates) {
    if (allowedFields.includes(field)) {
      accounts[coachIndex][field] = updates[field];
      hasUpdates = true;
    }
  }

  if (!hasUpdates) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  res.status(200).json({
    message: 'Coach updated successfully',
    coach: {
      id: accounts[coachIndex].id,
      name: accounts[coachIndex].name,
      email: accounts[coachIndex].email,
      section: accounts[coachIndex].section,
      session: accounts[coachIndex].session
    }
  });
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete a student (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 */
app.delete('/students/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const studentIndex = accounts.findIndex(u => u.id === parseInt(id) && u.role === 'student');
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deletedStudent = accounts.splice(studentIndex, 1)[0];
  const { password, ...studentData } = deletedStudent;

  res.status(200).json({
    message: 'Student deleted successfully',
    student: studentData
  });
});

/**
 * @swagger
 * /coaches/{id}:
 *   delete:
 *     tags: [Coaches]
 *     summary: Delete a coach (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coach deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Coach not found
 *       400:
 *         description: Coach has assigned students
 */
app.delete('/coaches/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const coachIndex = accounts.findIndex(u => u.id === parseInt(id) && u.role === 'coach');
  if (coachIndex === -1) {
    return res.status(404).json({ message: 'Coach not found' });
  }

  const hasStudents = accounts.some(
    u => u.role === 'student'
      && u.section === accounts[coachIndex].section
      && u.session === accounts[coachIndex].session
  );

  if (hasStudents) {
    return res.status(400).json({
      message: 'Cannot delete coach with assigned students. Reassign students first.'
    });
  }

  const deletedCoach = accounts.splice(coachIndex, 1)[0];
  const { password, ...coachData } = deletedCoach;

  res.status(200).json({
    message: 'Coach deleted successfully',
    coach: coachData
  });
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: Coach management endpoints
 */

/**
 * @swagger
 * /coaches:
 *   get:
 *     tags: [Coaches]
 *     summary: Get all coaches (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coaches
 *       403:
 *         description: Admin access required
 */
app.get('/coaches', authenticate, (req, res) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const coaches = accounts
    .filter(user => user.role === 'coach')
    .map(({ password, ...coach }) => coach);

  res.json(coaches);
});

/**
 * @swagger
 * /add-coach:
 *   post:
 *     tags: [Coaches]
 *     summary: Add a new coach (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               section:
 *                 type: string
 *               session:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - section
 *     responses:
 *       201:
 *         description: Coach added successfully
 *       400:
 *         description: Email, section and session are required
 *       403:
 *         description: Only admin can add coaches
 *       409:
 *         description: Coach already exists
 *       500:
 *         description: Internal server error
 */
app.post('/add-coach', authenticate, async (req, res) => {
  const { email, section, session, name } = req.body;
  const { role } = req.user;

  if (!email || !section || !session || !name) {
    return res.status(400).json({ message: 'Email, section and session are required.' });
  }

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can add coaches' });
  }

  if (accounts.some(user => user.email === email)) {
    return res.status(409).json({ message: 'Coach already exists.' });
  }

  try {
    const saltRounds = 10;
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const newCoach = {
      id: accounts.length + 1,
      email,
      name: name,
      password: hashedPassword,
      role: 'coach',
      section,
      session: session,
      active: false,
      passwordChangedAt: new Date()
    };

    accounts.push(newCoach);

    const { password, ...coachData } = newCoach;
    res.status(201).json({
      message: 'Coach added successfully',
      temporaryPassword: randomPassword,
      coach: coachData
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /user/preferences:
 *   get:
 *     tags: [Users]
 *     summary: Get user preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
app.get('/user/preferences', authenticate, (req, res) => {
  const { email } = req.user;
  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return user preferences (create if doesn't exist)
  user.preferences = user.preferences || {
    darkMode: false,
    language: 'English',
    timezone: 'UTC'
  };

  res.json(user.preferences);
});

/**
 * @swagger
 * /user/preferences:
 *   put:
 *     tags: [Users]
 *     summary: Update user preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               darkMode:
 *                 type: boolean
 *               language:
 *                 type: string
 *               timezone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
app.put('/user/preferences', authenticate, (req, res) => {
  const { email } = req.user;
  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.preferences = {
    ...user.preferences,
    ...req.body
  };

  res.json(user.preferences);
});

/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               timezone:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
app.put('/user/profile', authenticate, (req, res) => {
  const { email } = req.user;
  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update allowed fields
  const allowedFields = ['firstName', 'lastName', 'timezone', 'language'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const { password: _, ...userData } = user;
  res.json(userData);
});

/**
 * @swagger
 * /notifications/preferences:
 *   get:
 *     tags: [Users]
 *     summary: Get notification preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
app.get('/notifications/preferences', authenticate, (req, res) => {
  const { email } = req.user;
  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return notification preferences (create if doesn't exist)
  user.notificationPreferences = user.notificationPreferences || {
    emailUpdates: true,
    appNotifications: true,
    marketingEmails: false
  };

  res.json(user.notificationPreferences);
});

/**
 * @swagger
 * /notifications/preferences:
 *   put:
 *     tags: [Users]
 *     summary: Update notification preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailUpdates:
 *                 type: boolean
 *               appNotifications:
 *                 type: boolean
 *               marketingEmails:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
app.put('/notifications/preferences', authenticate, (req, res) => {
  const { email } = req.user;
  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...req.body
  };

  res.json(user.notificationPreferences);
});

// Start the server
initializeAccounts().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
});