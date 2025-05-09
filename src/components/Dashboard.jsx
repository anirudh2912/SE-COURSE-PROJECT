import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FiPlus, FiX } from 'react-icons/fi';

// Icons import with fallback
let FiSearch, FiLogOut, FiHeart, FiMessageSquare, FiBookmark, FiUserPlus, FiSend, FiShare2, FiUsers, FiUser, FiClock, FiCalendar, FiBell, FiSettings, FiMoon, FiSun, FiStar, FiMapPin, FiHome;
try {
  const icons = require('react-icons/fi');
  FiSearch = icons.FiSearch;
  FiLogOut = icons.FiLogOut;
  FiHeart = icons.FiHeart;
  FiMessageSquare = icons.FiMessageSquare;
  FiBookmark = icons.FiBookmark;
  FiUserPlus = icons.FiUserPlus;
  FiSend = icons.FiSend;
  FiShare2 = icons.FiShare2;
  FiUsers = icons.FiUsers;
  FiUser = icons.FiUser;
  FiClock = icons.FiClock;
  FiCalendar = icons.FiCalendar;
  FiBell = icons.FiBell;
  FiSettings = icons.FiSettings;
  FiMoon = icons.FiMoon;
  FiSun = icons.FiSun;
  FiStar = icons.FiStar;
  FiMapPin = icons.FiMapPin;
  FiHome = icons.FiHome;
} catch (e) {
  FiSearch = () => <span>🔍</span>;
  FiLogOut = () => <span>🚪</span>;
  FiHeart = () => <span>❤️</span>;
  FiMessageSquare = () => <span>💬</span>;
  FiBookmark = () => <span>🔖</span>;
  FiUserPlus = () => <span>👥</span>;
  FiSend = () => <span>✉️</span>;
  FiShare2 = () => <span>↗️</span>;
  FiUsers = () => <span>👥</span>;
  FiUser = () => <span>👤</span>;
  FiClock = () => <span>⏱️</span>;
  FiCalendar = () => <span>📅</span>;
  FiBell = () => <span>🔔</span>;
  FiSettings = () => <span>⚙️</span>;
  FiMoon = () => <span>🌙</span>;
  FiSun = () => <span>☀️</span>;
  FiStar = () => <span>⭐</span>;
  FiMapPin = () => <span>📍</span>;
  FiHome = () => <span>🏠</span>;
}

const Dashboard = ({ currentUser, setCurrentUser, myConnections, setMyConnections }) => {
  const navigate = useNavigate();
  const [activePost, setActivePost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeSection, setActiveSection] = useState('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'connection',
      message: 'Rahul accepted your connection request',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'event',
      message: 'Tech Workshop: AI & ML starts in 2 hours',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'job',
      message: 'New job posting matches your profile',
      time: '3h ago',
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [showAlumniPost, setShowAlumniPost] = useState(false);
  const [alumniPostText, setAlumniPostText] = useState('');
  
  // Network data
  const networkStats = {
    connections: 142,
    pending: 5
  };

  const [pendingConnections, setPendingConnections] = useState([
    { id: 7, name: 'Neha Gupta', initials: 'NG', title: 'Alumni - Class of 2021' },
    { id: 8, name: 'Rahul Verma', initials: 'RV', title: 'Student - 2nd Year' },
    { id: 9, name: 'Sonia Mehra', initials: 'SM', title: 'Student - 1st Year' },
    { id: 10, name: 'Vikram Singh', initials: 'VS', title: 'Alumni - Class of 2023' },
    { id: 11, name: 'Aarav Patel', initials: 'AP', title: 'Student - 3rd Year' },
    { id: 12, name: 'Meena Rao', initials: 'MR', title: 'Alumni - Class of 2022' }
  ]);

  const [suggestions, setSuggestions] = useState([
    {
      id: 9,
      initials: 'AS',
      name: 'Arjun Singh',
      title: 'Alumni - Class of 2020',
      mutual: 3,
      requested: false
    },
    {
      id: 10,
      initials: 'PK',
      name: 'Priya Kapoor',
      title: 'Alumni - Class of 2022',
      mutual: 5,
      requested: false
    },
    {
      id: 11,
      initials: 'RT',
      name: 'Rahul Thakur',
      title: 'Student - 4th Year',
      mutual: 2,
      requested: false
    }
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        initials: 'RP',
        name: 'Ravi Prakash',
        title: 'Alumni - Class of 2022',
        time: '2h ago'
      },
      content: "Excited to share that TechSolutions is hiring fresh graduates for Software Engineer roles!",
      jobPosting: {
        position: 'Software Engineer - Entry Level',
        company: 'TechSolutions Inc.',
        type: 'Full-time',
        location: 'Hyderabad (Remote available)',
        skills: ['Java', 'Python', 'Algorithms'],
        deadline: 'May 15, 2025',
        applyLink: 'https://jobs.lever.co/aidash/d7758deb-b3e3-4ad1-b5b7-08aef3fa79f3/'
      },
      engagement: {
        likes: 24,
        comments: 8,
        saved: false,
        liked: false
      },
      comments: []
    },
    {
      id: 2,
      user: {
        initials: 'KK',
        name: 'Krishna Kumar',
        title: 'Alumni - Class of 2021',
        time: '1d ago'
      },
      content: "Great opportunity for current students! GE Vernova is looking for interns in Hyderabad.",
      jobPosting: {
        position: 'Intern at GE Vernova',
        company: 'GE Vernova',
        type: 'Internship',
        location: 'Hyderabad, Telangana',
        skills: ['Engineering', 'Power Systems', 'Renewable Energy'],
        deadline: 'June 1, 2025',
        applyLink: 'https://careers.gevernova.com/global/en/job/GVXGVWGLOBALR5010151EXTERNALENGLOBAL/Intern'
      },
      engagement: {
        likes: 18,
        comments: 5,
        saved: false,
        liked: false
      },
      comments: []
    },
    {
      id: 3,
      user: {
        initials: 'SK',
        name: 'Sanjay Kumar',
        title: 'Alumni - Class of 2020',
        time: '3d ago'
      },
      content: "AWS is hiring engineering interns in Bangalore. Great opportunity for CS students!",
      jobPosting: {
        position: 'Engineering Intern for AWS',
        company: 'Curriculum Associates (AWS Partner)',
        type: 'Internship',
        location: 'Bangalore, India',
        skills: ['AWS', 'Cloud Computing', 'Software Development'],
        deadline: 'May 30, 2025',
        applyLink: 'https://curriculumassociates.wd5.myworkdayjobs.com/External/job/Bangalore-India/Engineering-Intern_JR04089?source=KrishanKumarLinkedin'
      },
      engagement: {
        likes: 32,
        comments: 12,
        saved: false,
        liked: false
      },
      comments: []
    }
  ]);

  // New state for events
  const [events] = useState([
    {
      id: 1,
      title: 'Summer Internship 2025',
      date: '2025-07-20',
      location: 'Main Auditorium',
      type: 'Career',
      registrationLink: 'https://forms.office.com/pages/responsepage.aspx?id=ZJH4ixGzykCilS4PXznRTsL9tAdvlIREiSC81MY55FZUNzNRWFpQTFZZMFYzR0VGQ0tQWjhTN0JCVC4u&route=shorturl'
    },
    {
      id: 2,
      title: 'Summer Workshop',
      date: '2025-05-09',
      location: 'Main Auditorium',
      type: 'Workshop',
      registrationLink: 'https://forms.gle/hqRFaG4VYqHm4ApeA'
    },
    {
      id: 3,
      title: 'Alumni Meet',
      date: '2024-05-20',
      time: '6:00 PM',
      location: 'Auditorium',
      type: 'Networking',
      attendees: 85
    }
  ]);

  // Chat state
  const [openChatUser, setOpenChatUser] = useState(null); // user object of the person being chatted with
  const [chatMessages, setChatMessages] = useState({}); // { [userId]: [{from, text, time}] }
  const [chatInput, setChatInput] = useState('');

  // Add state for search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Debug: Log myConnections and searchResults
  useEffect(() => {
    console.log('myConnections:', myConnections);
    console.log('searchTerm:', searchTerm);
    console.log('searchResults:', searchResults);
  }, [myConnections, searchTerm, searchResults]);

  // Update search results when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      setSearchResults(
        myConnections.filter(person =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, myConnections]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          engagement: {
            ...post.engagement,
            likes: post.engagement.liked ? post.engagement.likes - 1 : post.engagement.likes + 1,
            liked: !post.engagement.liked
          }
        };
      }
      return post;
    }));
  };

  const handleSave = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          engagement: {
            ...p.engagement,
            saved: !p.engagement.saved
          }
        };
      }
      return p;
    }));
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              user: {
                initials: currentUser.name.split(' ').map(n => n[0]).join(''),
                name: currentUser.name
              },
              text: commentText,
              time: 'Just now'
            }
          ],
          engagement: {
            ...post.engagement,
            comments: post.engagement.comments + 1
          }
        };
      }
      return post;
    }));
    
    setCommentText('');
    setActivePost(null);
  };

  const handleShare = (postId) => {
    const post = posts.find(p => p.id === postId);
    const shareText = `${post.user.name} shared: ${post.content}`;
    const shareUrl = `https://muconnect.com/posts/${postId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'MU Connect Post',
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      const socialWindow = window.open('', '_blank');
      socialWindow.document.write(`
        <html>
          <head><title>Share Post</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Share this post</h2>
            <p>${shareText}</p>
            <div style="margin-top: 20px;">
              <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" 
                 style="display: inline-block; margin-right: 10px; padding: 10px; background: #25D366; color: white; text-decoration: none; border-radius: 5px;">
                WhatsApp
              </a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}" 
                 style="display: inline-block; margin-right: 10px; padding: 10px; background: #4267B2; color: white; text-decoration: none; border-radius: 5px;">
                Facebook
              </a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}" 
                 style="display: inline-block; margin-right: 10px; padding: 10px; background: #1DA1F2; color: white; text-decoration: none; border-radius: 5px;">
                Twitter
              </a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.user.name + ' shared on MU Connect')}&summary=${encodeURIComponent(shareText)}" 
                 style="display: inline-block; margin-right: 10px; padding: 10px; background: #0077B5; color: white; text-decoration: none; border-radius: 5px;">
                LinkedIn
              </a>
            </div>
          </body>
        </html>
      `);
    }
  };

  const handleApply = (applyLink) => {
    window.open(applyLink, '_blank');
  };

  const handleConnect = (personId) => {
    setConnectionRequests([...connectionRequests, personId]);
    setSuggestions(suggestions.map(person => 
      person.id === personId ? {...person, requested: true} : person
    ));
    alert(`Connection request sent to ${suggestions.find(p => p.id === personId).name}`);
  };

  // Open chat with a connection
  const handleOpenChat = (person) => {
    setOpenChatUser(person);
    setChatInput('');
  };

  // Send a message in chat
  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !openChatUser) return;
    const userId = openChatUser.id;
    const newMsg = {
      from: currentUser.name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMsg]
    }));
    setChatInput('');
  };

  // Close chat
  const handleCloseChat = () => {
    setOpenChatUser(null);
    setChatInput('');
  };

  // Chat UI modal
  const renderChatModal = () => {
    if (!openChatUser) return null;
    const userId = openChatUser.id;
    const messages = chatMessages[userId] || [];
    return (
      <div className="chat-modal-overlay" onClick={handleCloseChat}>
        <div className="chat-modal" onClick={e => e.stopPropagation()}>
          <div className="chat-modal-header">
            <div className="avatar-md">{openChatUser.initials}</div>
            <div>
              <h4 style={{margin:0}}>{openChatUser.name}</h4>
              <small>{openChatUser.title}</small>
            </div>
            <button className="close-chat-btn" onClick={handleCloseChat}>&times;</button>
          </div>
          <div className="chat-modal-messages">
            {messages.length === 0 && <div className="chat-empty">No messages yet.</div>}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from === currentUser.name ? 'sent' : 'received'}`}> 
                <div className="chat-msg-content">{msg.text}</div>
                <div className="chat-msg-meta">{msg.from === currentUser.name ? 'You' : msg.from} • {msg.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-modal-input-row">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
            />
            <button className="send-btn" onClick={handleSendChatMessage}><FiSend /></button>
          </div>
        </div>
      </div>
    );
  };

  // Accept a pending connection
  const handleAcceptConnection = (personId) => {
    const person = pendingConnections.find(p => p.id === personId);
    if (person) {
      setPendingConnections(pendingConnections.filter(p => p.id !== personId));
      setMyConnections([...myConnections, person]);
      setAcceptedCount(acceptedCount + 1);
    }
  };

  // Ignore a pending connection
  const handleIgnoreConnection = (personId) => {
    setPendingConnections(pendingConnections.filter(p => p.id !== personId));
  };

  const handleAlumniPost = () => {
    if (!alumniPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      user: {
        initials: currentUser.name.split(' ').map(n => n[0]).join(''),
        name: currentUser.name,
        title: 'Alumni',
        time: 'Just now'
      },
      content: alumniPostText,
      engagement: {
        likes: 0,
        comments: 0,
        saved: false,
        liked: false
      },
      comments: []
    };
    setPosts([newPost, ...posts]);
    setAlumniPostText('');
    setShowAlumniPost(false);
  };

  const renderProfileSection = () => (
    <div className="profile-section">
      <div className="profile-card">
        <div className="avatar-lg">
          {currentUser?.name?.split(' ').map(n => n[0]).join('')}
        </div>
        <h3>{currentUser?.name}</h3>
        <p className="user-title">{currentUser?.email?.replace('@mahindrauniversity.edu.in', '')}</p>
        <div className="network-stats">
          <div className="stat-item">
            <span className="stat-number">{100 + acceptedCount}</span>
            <span className="stat-label">Connections</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pendingConnections.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>
      <div className="connections-section">
        <h3>Pending Connection Requests</h3>
        {pendingConnections.length === 0 && <div style={{color:'#888',textAlign:'center'}}>No pending requests.</div>}
        {pendingConnections.map(person => (
          <div key={person.id} className="connection-item">
            <div className="avatar-md">{person.initials}</div>
            <div className="connection-info">
              <h4>{person.name}</h4>
              <p>{person.title}</p>
            </div>
            <div className="connection-actions">
              <button className="accept-btn" onClick={() => handleAcceptConnection(person.id)}>Accept</button>
              <button className="ignore-btn" onClick={() => handleIgnoreConnection(person.id)}>Ignore</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNetworkSection = () => (
    <div className="network-section">
      <h2>My Connections</h2>
      <div className="connections-grid">
        {myConnections.map(person => (
          <div key={person.id} className="connection-card">
            <div className="avatar-lg">{person.initials}</div>
            <h4>{person.name}</h4>
            <p>{person.title}</p>
            <button className="message-btn" onClick={() => handleOpenChat(person)}>Message</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuggestionsSection = () => (
    <div className="suggestions-section">
      <h2>People You May Know</h2>
      {suggestions.map(person => (
        <div key={person.id} className="suggestion-item">
          <div className="avatar-md">{person.initials}</div>
          <div className="suggestion-info">
            <h4>{person.name}</h4>
            <p>{person.title}</p>
            <small>{person.mutual} mutual connections</small>
          </div>
          <button 
            className={`connect-btn ${person.requested ? 'requested' : ''}`}
            onClick={() => handleConnect(person.id)}
            disabled={person.requested}
          >
            <FiUserPlus /> {person.requested ? 'Requested' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderFeed = () => (
    <div className="feed-section" style={{ position: 'relative' }}>
      {/* Alumni Plus Button */}
      {currentUser?.userType === 'alumni' && (
        <button className="alumni-plus-btn" onClick={() => setShowAlumniPost(true)} title="Post anything">
          <FiPlus size={28} />
        </button>
      )}
      {/* Alumni Post Modal */}
      {showAlumniPost && (
        <div className="alumni-post-modal">
          <div className="alumni-post-content">
            <button className="alumni-post-close" onClick={() => setShowAlumniPost(false)}><FiX /></button>
            <h3>Post to Feed</h3>
            <textarea
              className="alumni-post-textarea"
              placeholder="Share anything with the network..."
              value={alumniPostText}
              onChange={e => setAlumniPostText(e.target.value)}
              rows={4}
              autoFocus
            />
            <button className="alumni-post-submit" onClick={handleAlumniPost} disabled={!alumniPostText.trim()}>
              Post
            </button>
          </div>
        </div>
      )}
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="avatar-md">{post.user.initials}</div>
            <div className="post-user-info">
              <h4>{post.user.name}</h4>
              <p>{post.user.title} • {post.user.time}</p>
            </div>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {post.jobPosting && (
            <div className="job-card">
              <h4>{post.jobPosting.position}</h4>
              <p className="company">{post.jobPosting.company} • {post.jobPosting.type}</p>
              <p className="location">{post.jobPosting.location}</p>
              
              <div className="skills">
                {post.jobPosting.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">[{skill}]</span>
                ))}
              </div>
              
              <div className="job-footer">
                <span className="deadline">Apply by {post.jobPosting.deadline}</span>
                <button 
                  className="apply-btn"
                  onClick={() => handleApply(post.jobPosting.applyLink)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}

          <div className="post-actions">
            <button 
              onClick={() => handleLike(post.id)}
              className={post.engagement.liked ? 'active' : ''}
            >
              <FiHeart /> Like ({post.engagement.likes})
            </button>
            <button onClick={() => setActivePost(activePost === post.id ? null : post.id)}>
              <FiMessageSquare /> Comment ({post.engagement.comments})
            </button>
            <button 
              onClick={() => handleSave(post.id)}
              className={post.engagement.saved ? 'active' : ''}
            >
              <FiBookmark /> {post.engagement.saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => handleShare(post.id)}>
              <FiShare2 /> Share
            </button>
          </div>

          {activePost === post.id && (
            <div className="comment-section">
              <div className="comment-input">
                <div className="avatar-sm">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                />
                <button 
                  className="send-btn"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  <FiSend />
                </button>
              </div>
              {post.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="avatar-sm">{comment.user.initials}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{comment.user.name}</span>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEventsSection = () => (
    <div className="events-section">
      <h2>Upcoming Events</h2>
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <FiCalendar className="event-icon" />
              <span className="event-type">{event.type}</span>
            </div>
            <h3>{event.title}</h3>
            <div className="event-details">
              <p><FiClock /> {event.date}</p>
              <p><FiMapPin /> {event.location}</p>
            </div>
            {event.registrationLink && (
              <button 
                className="register-btn"
                onClick={() => window.open(event.registrationLink, '_blank')}
              >
                Register Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSavedItemsSection = () => (
    <div className="saved-items-section">
      <h2>Saved Items</h2>
      <div className="saved-items-grid">
        {posts.filter(post => savedPosts.includes(post.id)).map(post => (
          <div key={post.id} className="saved-item-card">
            <div className="saved-item-header">
              <div className="avatar-md">{post.user.initials}</div>
              <div className="saved-item-info">
                <h4>{post.user.name}</h4>
                <p>{post.user.title}</p>
              </div>
            </div>
            <div className="saved-item-content">
              <p>{post.content}</p>
              {post.jobPosting && (
                <div className="saved-job-info">
                  <h4>{post.jobPosting.position}</h4>
                  <p>{post.jobPosting.company}</p>
                </div>
              )}
            </div>
            <div className="saved-item-actions">
              <button onClick={() => handleSave(post.id)}>
                <FiBookmark /> Remove from Saved
              </button>
              <button onClick={() => setActiveSection('feed')}>
                View Original Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsPanel = () => (
    <div className={`notifications-panel ${showNotifications ? 'show' : ''}`}>
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button onClick={() => setShowNotifications(false)}>×</button>
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && (
              <button 
                className="mark-read-btn"
                onClick={() => {
                  setNotifications(notifications.map(n => 
                    n.id === notification.id ? {...n, read: true} : n
                  ));
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className={`quick-actions ${showQuickActions ? 'show' : ''}`}>
      <button onClick={() => setActiveSection('events')}>
        <FiCalendar /> View Events
      </button>
      <button onClick={() => setActiveSection('saved')}>
        <FiBookmark /> Saved Items
      </button>
      <button onClick={() => setActiveSection('profile')}>
        <FiSettings /> Profile Settings
      </button>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FiSun /> : <FiMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <div className="logo">MU Connect</div>
        <div className="header-content">
          <div className="search-bar" style={{ position: 'relative' }}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for students, alumni, or opportunities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {/* Show message if myConnections is empty */}
            {myConnections.length === 0 && (
              <div style={{ color: 'red', background: '#fffbe6', padding: '8px', borderRadius: '6px', marginTop: '4px', position: 'absolute', zIndex: 1001 }}>
                No connections found. Add people to your network to search.
              </div>
            )}
            {/* Search results dropdown */}
            {searchTerm && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map(person => (
                  <div
                    key={person.id}
                    className="search-result-item"
                    onClick={() => navigate(`/profile/${person.id}`)}
                  >
                    <div className="avatar-md">{person.initials}</div>
                    <div className="search-result-info">
                      <div className="search-result-name">{person.name}</div>
                      <div className="search-result-title">{person.title}</div>
                      {person.bio && (
                        <div className="search-result-bio">{person.bio}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Show message if no results */}
            {searchTerm && searchResults.length === 0 && myConnections.length > 0 && (
              <div style={{ color: '#888', background: '#fffbe6', padding: '8px', borderRadius: '6px', marginTop: '4px', position: 'absolute', zIndex: 1001 }}>
                No results found.
              </div>
            )}
          </div>
          <div className="navigation-menu">
            <button 
              className="nav-btn"
              onClick={() => navigate('/home')}
            >
              <FiHome /> Home
            </button>
            <button 
              className={`nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <FiUser /> My Profile
            </button>
            <button 
              className={`nav-btn ${activeSection === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveSection('feed')}
            >
              <FiMessageSquare /> Feed
            </button>
            <button 
              className={`nav-btn ${activeSection === 'network' ? 'active' : ''}`}
              onClick={() => setActiveSection('network')}
            >
              <FiUsers /> My Network
            </button>
            <button 
              className={`nav-btn ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => setActiveSection('events')}
            >
              <FiCalendar /> Events
            </button>
            <button 
              className={`nav-btn ${activeSection === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveSection('saved')}
            >
              <FiBookmark /> Saved
            </button>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button 
            className="quick-actions-btn"
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            <FiSettings />
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <main className="main-content">
          {activeSection === 'profile' && renderProfileSection()}
          {activeSection === 'feed' && renderFeed()}
          {activeSection === 'network' && renderNetworkSection()}
          {activeSection === 'suggestions' && renderSuggestionsSection()}
          {activeSection === 'events' && renderEventsSection()}
          {activeSection === 'saved' && renderSavedItemsSection()}
        </main>
      </div>

      {renderNotificationsPanel()}
      {renderQuickActions()}
      {renderChatModal()}
    </div>
  );
};

export default Dashboard;