import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import UploadSlip from './components/Upload/UploadSlip';
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails';

function App() {
  const isAuthenticated = () => {
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    return email && token;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<UploadSlip />} />
          <Route path="upload-slip" element={<UploadSlip />} />
          <Route path="employee-details" element={<EmployeeDetails />} />
          <Route path="dashboard" element={<UploadSlip />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
