const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 5000;

// Mock Database
let users = [
  { id: 1, name: 'Иван', email: 'ivan@example.com', password: 'password123' }
];

let progress = [
  { userId: 1, subject: 'Математика', completed: 28, total: 40 },
  { userId: 1, subject: 'Физика', completed: 35, total: 40 }
];

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.json({ success: true, user: { id: newUser.id, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Progress Routes
app.get('/api/progress/:userId', (req, res) => {
  const userProgress = progress.filter(p => p.userId === parseInt(req.params.userId));
  res.json(userProgress);
});

app.post('/api/progress', (req, res) => {
  const { userId, subject, completed, total } = req.body;
  const existingProgress = progress.find(p => p.userId === userId && p.subject === subject);
  
  if (existingProgress) {
    existingProgress.completed = completed;
    existingProgress.total = total;
  } else {
    progress.push({ userId, subject, completed, total });
  }
  
  res.json({ success: true });
});

// Recommendations
app.get('/api/recommendations/:userId', (req, res) => {
  const recommendations = [
    { id: 1, title: 'Улучши Химию', difficulty: 'medium', estimatedTime: '45 мин' },
    { id: 2, title: 'Продолжи Физику', difficulty: 'hard', estimatedTime: '60 мин' }
  ];
  res.json(recommendations);
});

// Analytics
app.get('/api/analytics', (req, res) => {
  res.json({
    totalUsers: users.length,
    averageProgress: 68,
    totalQuizzes: 156,
    completionRate: 73
  });
});

app.listen(PORT, () => console.log(`Learning Dashboard Server running on port ${PORT}`));