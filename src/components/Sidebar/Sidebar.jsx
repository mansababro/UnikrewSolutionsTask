import React from 'react';
import { useNavigate } from 'react-router-dom';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from "../../Assets/logo.png";
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Force a page reload

  
  };

  return (
    <div className="sidebar">
      <div className="wrapper">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className='option-wrapper'>
          <div className="sidebar-link" onClick={() => navigate('/dashboard')}>
            Dashboard <DashboardIcon className="sidebar-icon" />
          </div>
          <div className="sidebar-link" onClick={() => navigate('/upload-slip')}>
            Upload Slip <DriveFolderUploadIcon className="sidebar-icon" />
          </div>
          <div className="sidebar-link" onClick={() => navigate('/employee-details')}>
            Employee Details <PersonIcon className="sidebar-icon" />
          </div>
        </div>
        <div className='logout' onClick={handleLogout}>
          <div className="sidebar-link">
            Logout <ExitToAppIcon className="sidebar-icon" />
          </div>
        </div>
      </div>
      <div className="backdrop" />
    </div>
  );
};

export default Sidebar;
