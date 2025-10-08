import React from 'react'
import KhaoCook5 from '../pictures/KhaoCook5.png'

const Header: React.FC = () => {
  return (
    <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={KhaoCook5} alt="KhaoCook Logo" className="logo-image" />
                </div>
                <div className="navbar-profile">
                    <button className="profile-button">
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                </div>
            </div>
    </nav>
  )
}

export default Header