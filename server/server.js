require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


let accounts = [];




// Update the accounts initialization to include sample student data with all fields
async function initializeAccounts() {
  const saltRounds = 10;

  const users = [
    { email: "admin@gmail.com", password: "admin", role: "admin" },
    { name: "Mehmet Cansız", email: "coach@gmail.com", password: "coach", group: "A", role: "coach" },
    { name: "Ahmet Çetin", email: "coach2@gmail.com", password: "coach2", group: "B", role: "coach" },

    {
      email: "student@gmail.com", password: "student", group: "A", role: "student",
      firstName: "Mehmet",
      lastName: "Yılmaz",
      birthDate: "2010-05-15",
      gender: "Male",
      parentName: "Ali Yılmaz",
      parentPhone: "5551234567",
      notes: "Örnek öğrenci",
      startDate: "2023-09-01",
      performanceNotes: []
    },
    //add another student
    {
      email: "student2@gmail.com", password: "student2", group: "B", role: "student",
      firstName: "Ayşe",
      lastName: "Demir",
      birthDate: "2011-03-20",
      gender: "Female",
      parentName: "Fatma Demir",
      parentPhone: "5559876543",
      notes: "Örnek öğrenci 2",
      startDate: "2025-12-25",
      performanceNotes: []
    }

  ];

  for (let i = 0; i < users.length; i++) {
    const hashedPassword = await bcrypt.hash(users[i].password, saltRounds);
    accounts.push({
      id: i + 1,
      email: users[i].email,
      password: hashedPassword,
      role: users[i].role,
      passwordChangedAt: new Date(),
      ...(users[i].role === 'coach' && { group: users[i].group }),
      ...(users[i].role === 'student' && {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        birthDate: users[i].birthDate,
        gender: users[i].gender,
        group: users[i].group,
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

function verifyToken(token, secret) {
  if (!token) {
    throw new Error('No token provided');
  }
  
  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret);
    
    // Find the user
    const user = accounts.find(u => u.email === decoded.email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if token was issued before password was changed
    if (decoded.iat && user.passwordChangedAt && 
        (decoded.iat * 1000 < new Date(user.passwordChangedAt).getTime())) {
          // debug
          console.log('Token issued before password change:', decoded.iat, user.passwordChangedAt);
          console.log('Current time:', new Date().getTime());
          // debug end
      throw new Error('Password has been changed, please login again');
    }
    
    return decoded;
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error(error.message || 'Token verification failed');
  }
}



// Register endpoint
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
    res.status(201).json({ 
      message: 'Registration successful',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});



// Login endpoint
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
      { email: user.email, role: user.role, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userData } = user;
    res.json({ 
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});



const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};


// Get all users (for admin use only)
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


app.get('/profile', authenticate, (req, res) => {
  const user = accounts.find(u => u.email === req.user.email); 
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});




// Update the add-student endpoint to include all student fields
app.post('/add-student', authenticate, async (req, res) => {
  const { role, email } = req.user;
  const studentData = req.body;

  if (role !== 'admin' && role !== 'coach') {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  // Validate required fields
  const requiredFields = ['email', 'firstName', 'lastName', 'birthDate', 'gender', 'parentName', 'parentPhone'];
  const missingFields = requiredFields.filter(field => !studentData[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      missing: missingFields
    });
  }

  // Check if student exists
  if (accounts.some(user => user.email === studentData.email)) {
    return res.status(409).json({ message: 'Student already exists' });
  }

  try {
    const saltRounds = 10;
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    // Determine group assignment
    let assignedGroup = studentData.group;
    if (role === 'coach') {
      const coach = accounts.find(u => u.email === email);
      assignedGroup = coach?.group;
    }

    const newStudent = {
      id: accounts.length + 1,
      email: studentData.email,
      password: hashedPassword,
      role: 'student',
      group: assignedGroup,
      ...studentData,
      performanceNotes: [],
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

// Add a new endpoint to update student information
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check authorization
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }


  try {
    decodedToken = verifyToken(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  const userRole = decodedToken.role;
  const userEmail = decodedToken.email;

  // Find student
  const studentIndex = accounts.findIndex(u => u.id === parseInt(id) && u.role === 'student');
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  // Permission check
  if (userRole === 'coach') {
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach || accounts[studentIndex].group !== coach.group) {
      return res.status(403).json({ message: 'You can only update students in your group.' });
    }
  } else if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Only admin or coach can update student information.' });
  }

  // Update student information
  const allowedFields = [
    'firstName', 'lastName', 'birthDate', 'gender', 'group',
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
      group: accounts[studentIndex].group
    }
  });
});

// Update the students endpoint to return all student information
app.get('/students', authenticate, (req, res) => {
  const userRole = req.user.role;
  const userEmail = req.user.email;
  
  if (userRole === 'admin') {
    // Admin can see all students
    const students = accounts
      .filter(user => user.role === 'student')
      .map(({ password, ...student }) => student); // Exclude password
    return res.json(students);
  } else if (userRole === 'coach') {
    // Coach can only see students in their group
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found.' });
    }
    if (!coach.group) {
      return res.status(400).json({ message: 'Coach is not assigned to any group.' });
    }
    const studentsInGroup = accounts
      .filter(user => user.group === coach.group && user.role === 'student')
      .map(({ password, ...student }) => student); // Exclude password
    return res.json(studentsInGroup);
  } else {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }
});

app.get('/students/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { role, email } = req.user; // From authenticate middleware

  // Find student (excluding password)
  const student = accounts.find(u => u.id === parseInt(id) && u.role === 'student');
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  // Permission check
  if (role === 'coach') {
    const coach = accounts.find(u => u.email === email && u.role === 'coach');
    if (!coach || student.group !== coach.group) {
      return res.status(403).json({ message: 'You can only view students in your group.' });
    }
  } else if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }

  // Return student data without password
  const { password, ...studentData } = student;
  res.json(studentData);
});


// list all coaches
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



// add new coach with name group mail and return random password
app.post('/add-coach', authenticate, async (req, res) => {
  const { email, group, name } = req.body;
  const { role } = req.user;

  if (!email || !group) {
    return res.status(400).json({ message: 'Email and group are required.' });
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
      name: name || email.split('@')[0],
      password: hashedPassword,
      role: 'coach',
      group,
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



// Change password endpoint (for all authenticated users)
app.post('/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both passwords are required' });
  }

  const user = accounts.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.active = true;
    
    // Generate new token with updated timestamp
    const token = jwt.sign(
      { email: user.email, role: user.role, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    user.passwordChangedAt = new Date();


    res.json({ 
      message: 'Password changed successfully',
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});




initializeAccounts().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});