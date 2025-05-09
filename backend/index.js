const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let users = []; // Simulated DB

app.post('/api/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const newUser = { name, email, password, role };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json(user);
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
