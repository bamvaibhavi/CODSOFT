import React from 'react'

function JobCard(props) {
    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
        }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {props.title}
            </h2>
            <p style={{ color: '#666', fontWeight: 'bold', margin: '5px 0' }}>
                🏢 {props.company}
            </p>
            <p style={{ margin: '5px 0' }}>📍 {props.location}</p>
            <p style={{ margin: '5px 0', color: 'green', fontWeight: 'bold' }}>
                💰 {props.salary}
            </p>

            <button
                onClick={() => alert(`Applied to ${props.company} successfully!`)}
                style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                Apply Now
            </button>
        </div>
    )
}

export default JobCard