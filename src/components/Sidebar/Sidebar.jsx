import React from 'react';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from "../../Assets/logo.png"
import './Sidebar.css'; // Make sure to create a corresponding CSS file

const Sidebar = () => {
//   const handleLogout = () => {
//     localStorage.removeItem('email');
//     localStorage.removeItem('password');
//     window.location.href = '/login'; // Redirect to login page
//   };

  return (
    <div className="sidebar">
      <div className="wrapper">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className='option-wrapper'>
          <div className="sidebar-link">Dashboard <DashboardIcon className="sidebar-icon" /></div>
          <div className="sidebar-link">Upload Slip <DriveFolderUploadIcon className="sidebar-icon" /></div>
          <div className="sidebar-link">Employee Details <PersonIcon className="sidebar-icon" /></div>
        </div>
        <div className='logout'>
          <div className="sidebar-link">Logout <ExitToAppIcon className="sidebar-icon" /></div>
          {/* onClick={handleLogout} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
