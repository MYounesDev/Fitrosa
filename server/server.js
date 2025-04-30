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


let accounts = [ ];


// Update the accounts initialization to include sample student data with all fields
async function initializeAccounts() {
  const saltRounds = 10;

  const users = [
    { email: "admin@gmail.com", password: "admin", role: "admin" },
    { email: "coach@gmail.com", password: "coach", group: "A", role: "coach" },
    { 
      email: "student@gmail.com", 
      password: "student", 
      group: "A", 
      role: "student",
      firstName: "Mehmet",
      lastName: "Yılmaz",
      birthDate: "2010-05-15",
      gender: "Erkek",
      parentName: "Ali Yılmaz",
      parentPhone: "5551234567",
      notes: "Örnek öğrenci",
      startDate: "2023-09-01",
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



// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Check if user already exists
  const existingUser = accounts.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: accounts.length + 1,
      email,
      password: hashedPassword,
      role: 'student' // or assign based on logic
    };

    accounts.push(newUser);
    console.log('User saved:', newUser);

    console.log(accounts);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = accounts.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful", role: user.role, token });
    } else {
      res.status(401).json({ message: 'Invalid password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});





// Middleware to check if user is authenticated
app.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
});

// Get all users (for admin use only)
app.get('/users', (req, res) => {
  const userRole = req.user.role;
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this route.' });
  }
  res.json(accounts);
});

// Get user profile from token (for all authenticated users)
app.get('/profile',(req, req) => {

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    const user = accounts.find(u => u.email === decoded.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  });

});




// Update the add-student endpoint to include all student fields
app.post('/add-student', async (req, res) => {
  const { 
    studentEmail, 
    targetGroup,
    firstName,
    lastName,
    birthDate,
    gender,
    parentName,
    parentPhone,
    notes,
    startDate
  } = req.body;

  if (!studentEmail || !firstName || !lastName || !birthDate || !gender || !parentName || !parentPhone || !startDate) {
    return res.status(400).json({ 
      message: 'Student email, first name, last name, birth date, gender, parent name, parent phone and start date are required.' 
    });
  }

  // Check authorization
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  const userRole = decodedToken.role;
  const userEmail = decodedToken.email;

  // Permission check
  if (userRole !== 'admin' && userRole !== 'coach') {
    return res.status(403).json({ message: 'Only admin or coach can add a student.' });
  }

  // Group assignment logic
  let assignedGroup;
  if (userRole === 'coach') {
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found.' });
    }
    if (!coach.group) {
      return res.status(400).json({ message: 'Coach is not assigned to any group.' });
    }
    assignedGroup = coach.group;
  } else {
    if (!targetGroup) {
      return res.status(400).json({ message: 'Target group is required for admin.' });
    }
    assignedGroup = targetGroup;
  }

  // Check if student exists
  if (accounts.some(user => user.email === studentEmail)) {
    return res.status(409).json({ message: 'Student already exists.' });
  }

  try {
    const saltRounds = 10;
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const newStudent = {
      id: accounts.length + 1,
      email: studentEmail,
      password: hashedPassword,
      role: 'student',
      group: assignedGroup,
      firstName,
      lastName,
      birthDate,
      gender,
      parentName,
      parentPhone,
      notes: notes || '',
      startDate,
      performanceNotes: [],
      needToChangePassword: true
    };

    accounts.push(newStudent);
    console.log('New student created:', newStudent);

    res.status(201).json({ 
      message: 'Student added successfully',
      temporaryPassword: randomPassword,
      student: {
        id: newStudent.id,
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        group: newStudent.group
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
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

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
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
app.get('/students', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
  
  const userRole = decodedToken.role;
  const userEmail = decodedToken.email;

  if (userRole === 'admin') {
    // Admin can see all students
    const students = accounts.filter(user => user.role === 'student');
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
    const studentsInGroup = accounts.filter(user => user.group === coach.group && user.role === 'student');
    return res.json(studentsInGroup);
  } else {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }
});

// Add a new endpoint to get a specific student's details
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
  
  const userRole = decodedToken.role;
  const userEmail = decodedToken.email;

  const student = accounts.find(u => u.id === parseInt(id) && u.role === 'student');
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  // Permission check
  if (userRole === 'coach') {
    const coach = accounts.find(u => u.email === userEmail && u.role === 'coach');
    if (!coach || student.group !== coach.group) {
      return res.status(403).json({ message: 'You can only view students in your group.' });
    }
  } else if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Only admin or coach can access this route.' });
  }

  res.json(student);
});


// Change password endpoint (for all authenticated users)
app.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }

  // Get token from header
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    // Verify token and get user email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Find user by email
    const user = accounts.find(u => u.email === userEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password.' });
    }

    // Update password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    user.needToChangePassword = false;

    return res.status(200).json({ message: 'Password changed successfully!' });
    
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
});





initializeAccounts().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});