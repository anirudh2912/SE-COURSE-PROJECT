import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [myConnections, setMyConnections] = useState([
    { id: 1, name: 'Ravi Prakash', initials: 'RP', title: 'Alumni - Class of 2022', bio: 'Software Engineer at TechSolutions. Loves AI and cricket. Currently pursuing MBA at ISB Hyderabad.', connections: [2, 3, 4, 5, 6], totalConnections: 150 },
    { id: 2, name: 'Krishna Kumar', initials: 'KK', title: 'Alumni - Class of 2021', bio: 'Power systems enthusiast. Working at GE Vernova.', connections: [1, 3] },
    { id: 3, name: 'Sanjay Kumar', initials: 'SK', title: 'Alumni - Class of 2020', bio: 'Cloud developer at AWS partner. Mentor for students.', connections: [1, 2, 4] },
    { id: 4, name: 'Priya Mehta', initials: 'PM', title: 'Student - 3rd Year', bio: 'Aspiring data scientist. Loves hackathons.', connections: [3, 5] },
    { id: 5, name: 'Amit Sharma', initials: 'AS', title: 'Alumni - Class of 2023', bio: 'Full-stack developer. Enjoys open source.', connections: [4, 6] },
    { id: 6, name: 'Aditya Patel', initials: 'AP', title: 'Student - 4th Year', bio: 'Robotics club president. Interested in IoT.', connections: [5] }
  ]);

  // Function to clear all user data
  const clearUserData = () => {
    localStorage.removeItem('mu-connect-current-user');
    localStorage.removeItem('mu-connect-users');
    setCurrentUser(null);
    setUsers([]);
    setMyConnections([]);
  };

  // Load users list from localStorage on first load
  useEffect(() => {
    // Load existing data from localStorage
    const storedUsers = localStorage.getItem('mu-connect-users');
    const storedCurrentUser = localStorage.getItem('mu-connect-current-user');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }

    setIsAuthChecked(true);
  }, []);

  // Persist users list to localStorage when changed
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('mu-connect-users', JSON.stringify(users));
    }
  }, [users]);

  // Persist current user to localStorage when changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mu-connect-current-user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Helper to render Profile with user data
  const renderProfile = (props) => {
    const { id } = props.match ? props.match.params : props.params;
    // Try to find the user in myConnections or suggestions
    const allUsers = [...users];
    const user = allUsers.find(u => String(u.id) === String(id));
    return <Profile user={user} />;
  };

  if (!isAuthChecked) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/home"
          element={
            currentUser ? (
              <Home currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile/:id"
          element={
            <ProfileWrapper myConnections={myConnections} />
          }
        />

        {/* Root redirects to login or dashboard */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginForm users={users} setCurrentUser={setCurrentUser} />
            )
          }
        />

        {/* Sign Up Route */}
        <Route
          path="/signup"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignUpForm users={users} setUsers={setUsers} />
            )
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser}
                myConnections={myConnections}
                setMyConnections={setMyConnections}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

function ProfileWrapper({ myConnections }) {
  const params = useParams();
  const user = myConnections.find(u => String(u.id) === String(params.id));
  
  if (!user) {
    return (
      <div className="profile-container">
        <h2>User not found</h2>
        <p>The requested profile could not be found.</p>
      </div>
    );
  }
  
  return <Profile user={user} allConnections={myConnections} />;
}

export default App;
