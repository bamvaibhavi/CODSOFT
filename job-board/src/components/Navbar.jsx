import React from 'react'

function Navbar({ userType, setUserType }) {
    const navBtnStyle = {
        background: '#4f46e5',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem'
    }

    return (
        <nav className="navbar">
            <div className="logo">🚀 JobHunter</div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
                {!userType ? (
                    <>
                        <button
                            onClick={() => setUserType('candidate')}
                            style={navBtnStyle}
                        >
                            Login as Candidate 👨‍💻
                        </button>
                        <button
                            onClick={() => setUserType('employer')}
                            style={{ ...navBtnStyle, background: '#1e293b' }}
                        >
                            Login as Employer 🏢
                        </button>
                    </>
                ) : (
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>
                            {userType === 'employer' ? 'Employer 👔' : 'Candidate 👨‍💻'}
                        </span>
                        <button
                            onClick={() => setUserType(null)}
                            style={{ ...navBtnStyle, background: '#ef4444' }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar