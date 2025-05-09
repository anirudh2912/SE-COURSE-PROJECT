// src/components/Profile.js
import React from 'react';
import './Profile.css';

function Profile({ user, allConnections = [] }) {
  if (!user) {
    return <div className="profile-container"><h2>User not found</h2></div>;
  }
  // Find connection details
  const userConnections = (user.connections || [])
    .map(cid => allConnections.find(u => u.id === cid))
    .filter(Boolean);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-names-row">
        {user.nickname ? (
          <span className="profile-nickname-name">
            <span className="profile-nickname">{user.nickname}</span>
            <span className="profile-name">({user.name})</span>
          </span>
        ) : (
          <span className="profile-name">{user.name}</span>
        )}
      </div>
      <div className="profile-info">
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          {user.email && <p><strong>Email:</strong> {user.email}</p>}
          {user.title && <p><strong>Title:</strong> {user.title}</p>}
          {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
          {user.totalConnections && <p><strong>Total Connections:</strong> {user.totalConnections}</p>}
        </div>
      </div>
      <div className="profile-connections">
        <h3>Connections</h3>
        {userConnections.length === 0 ? (
          <p>No connections</p>
        ) : (
          <ul>
            {userConnections.map(conn => (
              <li key={conn.id} style={{marginBottom: '0.8em', display: 'flex', alignItems: 'center'}}>
                <span className="avatar-md" style={{marginRight: '0.5em'}}>{conn.initials}</span>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span><strong>{conn.name}</strong> <span style={{color:'#666'}}>{conn.title}</span></span>
                  {conn.bio && (
                    <span style={{fontSize: '0.95em', color: '#444', marginTop: '0.2em'}}>{conn.bio}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
