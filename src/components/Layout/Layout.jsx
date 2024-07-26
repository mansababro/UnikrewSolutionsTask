import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import "../Layout/Layout.css"
// import UploadSlip from '../Upload/UploadSlip';
import EmployeeDetails from '../EmployeeDetails/EmployeeDetails';

const Layout = () => {
  return (
   <>
        <Container fluid>

          <Row>
            <Col lg={2} className='sidebarCol'>
                <Sidebar/>
            </Col>

            <Col lg={10} className='mainscreenCol'>
            {/* <UploadSlip/> */}
            <EmployeeDetails/>
            </Col>


          </Row>      

        </Container>
   </>
  );
};

export default Layout;
