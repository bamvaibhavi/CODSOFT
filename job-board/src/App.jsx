import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const addJob = (job) => {
    fetch('http://localhost:5000/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    })
      .then(res => res.json())
      .then(newJob => setJobs([newJob, ...jobs]));
  };

  const deleteJob = (id) => {
    fetch(`http://localhost:5000/jobs/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setJobs(jobs.filter(job => job._id !== id));
      })
      .catch(err => console.error("Error deleting job:", err));
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Navbar userType={userType} setUserType={setUserType} />

      
      {!userType ? (

        
        <div className="landing-window">

          
          <div className="landing-header">
            <h1 className="hero-title">Unlock Your Next Career 🚀</h1>
            <p className="hero-subtitle">
              Connect with top employers and find opportunities that match your skills perfectly.
            </p>
          </div>

          
          <div className="hero-search-container" style={{ margin: '-35px auto 0' }}>
            <input
              type="text"
              className="hero-input"
              placeholder="Job title, keywords, or company..."
              disabled
            />
            <button className="hero-btn" onClick={() => setUserType('candidate')}>
              Find Jobs
            </button>
          </div>

          
          <div className="landing-image-container">
            <img
              
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Male and Female IT Professionals with Laptops"
              className="professional-img"
            />

            <div style={{ marginTop: '30px', marginBottom: '20px', color: '#64748b' }}>
              <h3>👋 Ready to join them?</h3>
              <p>Login above to start your journey.</p>
            </div>
          </div>

        </div>

      ) : (


        
        <>
          
          <div style={{ marginBottom: '30px', marginTop: '20px' }}>
            <input
              type="text"
              placeholder="🔍 Search for a job (e.g. React, Mumbai)..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '2px solid #ddd' }}
            />
          </div>

          
          {userType === 'employer' && (
            <div className="dashboard-section">
              <h3 style={{ textAlign: 'center', color: '#4f46e5', marginBottom: '20px' }}>
                👔 Employer Dashboard
              </h3>
              <JobForm onAddJob={addJob} />
            </div>
          )}

          

          
          {userType === 'candidate' && (
            <>
              
              
              <div className="candidate-welcome-banner">
                
                <img
                  
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                  alt="Female Developer Sticker"
                  className="sticker-img"
                />

                <div className="welcome-text" style={{ textAlign: 'center' }}>
                  <h2>👋 Hi there, Future Tech Leader!</h2>
                  <p>Your skills are in demand. Let's find your perfect match.</p>
                </div>

                
                <img
                  
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
                  alt="Male Developer Sticker"
                  className="sticker-img"
                />
              </div>

              
              <div className="stats-container">
                
                <div className="stat-card">
                  <span className="stat-number">{jobs.length}</span>
                  <span className="stat-label">Active Jobs 📂</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">24h</span>
                  <span className="stat-label">Fast Response ⚡</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Verified Roles ✅</span>
                </div>
              </div>
            </>
          )}

          

          
          <JobList
            jobs={filteredJobs}
            onDeleteJob={deleteJob}
            userType={userType}
          />
        </>
      )}
    </div>
  )
}

export default App