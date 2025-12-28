import React, { useState } from 'react'

function JobForm({ onAddJob }) {
    const [job, setJob] = useState({ title: '', company: '', location: '', salary: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!job.title || !job.company) return alert("Please fill Title and Company!");
        onAddJob(job);
        setJob({ title: '', company: '', location: '', salary: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="job-form">
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>📢 Post a New Job</h3>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Job Title (e.g. React Developer)"
                    className="form-input"
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                />
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Company Name"
                    className="form-input"
                    value={job.company}
                    onChange={(e) => setJob({ ...job, company: e.target.value })}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Location"
                    className="form-input"
                    value={job.location}
                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Salary (e.g. $50k)"
                    className="form-input"
                    value={job.salary}
                    onChange={(e) => setJob({ ...job, salary: e.target.value })}
                />
            </div>

            <button type="submit" className="submit-btn" style={{ marginTop: '15px' }}>
                Post Job Now
            </button>
        </form>
    )
}

export default JobForm