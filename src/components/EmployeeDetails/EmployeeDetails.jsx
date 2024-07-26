import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './EmployeeDetails.css'; // Ensure you have CSS for styling

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-jekzxop/endpoint/GetEmpDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setEmployees(data.data); // Access data from the data field
        } else {
          console.error('Failed to fetch employee details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <h3 className='EmployeeDetailsTitle'>Employee Details</h3>
      <TableContainer component={Paper} className='EmployeeTable'>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="employee details table">
          <TableHead>
            <TableRow>
              <TableCell className='TitleX'>Emp#</TableCell>
              <TableCell className='TitleX'>Name</TableCell>
              <TableCell className='TitleX'>Email</TableCell>
              <TableCell className='TitleX'>Designation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='DataX'>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell component="th" scope="row" className='empNumber'>
                  {employee['Employee ID']}
                </TableCell>
                <TableCell className='empName'>{employee.Name}</TableCell>
                <TableCell className='empEmail'>{employee.Email}</TableCell>
                <TableCell className='empDesignation'>{employee.Designation || 'N/A'}</TableCell> {/* Handle missing designations */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default EmployeeDetails;
