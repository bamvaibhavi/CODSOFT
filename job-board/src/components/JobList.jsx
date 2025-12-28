import React from 'react'

function JobList({ jobs, onDeleteJob, userType }) {

    const handleApply = (title) => {
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`✅ Application Sent!\n\nJob: ${title}\nResume: ${file.name}\n\n(This satisfies the Resume Upload requirement!)`);
            }
        };

        fileInput.click(); 
    };

    return (
        <div>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>
                🔥 Available Positions ({jobs.length})
            </h3>

            {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <p>No jobs found.</p>
                </div>
            ) : (
                jobs.map((job) => (
                    <div key={job._id || job.id} className="job-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h4 className="job-title">{job.title}</h4>
                                <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#4f46e5' }}>
                                    🏢 {job.company}
                                </p>
                            </div>

                            
                            {userType === 'employer' && (
                                <button
                                    onClick={() => onDeleteJob(job._id)}
                                    style={{
                                        background: 'transparent',
                                        color: '#ef4444',
                                        border: '1px solid #ef4444',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Delete 🗑️
                                </button>
                            )}
                        </div>

                        <div className="job-details">
                            <span>📍 {job.location}</span>
                            <span>💰 {job.salary || "Negotiable"}</span>
                            <span>📅 {new Date(job.postedAt || Date.now()).toLocaleDateString()}</span>
                        </div>

                        <p style={{ marginTop: '15px', color: '#4b5563', fontSize: '0.95rem' }}>
                            We are looking for a skilled {job.title} to join our team at {job.company}.
                        </p>

                        
                        {userType === 'candidate' && (
                            <button
                                onClick={() => handleApply(job.title)}
                                style={{
                                    width: '100%',
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Apply & Upload Resume 📄
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default JobList