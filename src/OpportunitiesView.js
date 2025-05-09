import React from 'react';
import './Dashboard.css';

const opportunities = [
  { title: 'Internship Program', company: 'Google', type: 'Summer 2025' },
  { title: 'Campus Ambassador', company: 'Microsoft', type: 'Part-time' }
];

const OpportunitiesView = () => {
  return (
    <div className="dashboard">
      <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>New Opportunities</h2>
      <div className="opportunities-card" style={{ width: '50%', margin: 'auto' }}>
        {opportunities.map((o, i) => (
          <div key={i} className="opportunity-item">
            <h4>{o.title}</h4>
            <p>{o.company} • {o.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesView;
