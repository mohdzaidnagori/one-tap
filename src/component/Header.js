import React from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import './Header.css'

const Header = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    }
    const handleHome =() => {
        navigate('/')
    }
  
  return (
    <div className='header-emg'>
        <div className="header-icon">
        <span><BiArrowBack onClick={() => navigate(-1)}/></span>
          One Tap Emergency Services
        </div>
       <div className='header-button-flex'>
       <div className="header-logout">
            <button onClick={handleHome}>Home</button>
        </div>
        <div className="header-logout">
            <button onClick={handleLogout}>Logout</button>
        </div>
       </div>
    </div>
  )
}

export default Header