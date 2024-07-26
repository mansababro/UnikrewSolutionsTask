import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import "../Layout/Layout.css";

const Layout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={2} className='sidebarCol'>
            <Sidebar />
          </Col>
          <Col lg={10} className='mainscreenCol'>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Layout;
