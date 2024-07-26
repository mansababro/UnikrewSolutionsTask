import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Dashboard.css'; // Ensure you have CSS for styling

function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-jekzxop/endpoint/GetLogs', { // Replace with your actual API endpoint
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setLogs(data.data); // Access data from the data field
        } else {
          console.error('Failed to fetch logs');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <>
      <h1 className='DashboardWelcome'>Welcome</h1>
      <h2 className='DashboardHRHeading'>HR Dashboard</h2>
      <TableContainer component={Paper} className='DashboardTable'>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="upload logs table">
          <TableHead>
            <TableRow>
              <TableCell className='TitleX'>Upload ID</TableCell>
              <TableCell className='TitleX'>Filename</TableCell>
              <TableCell className='TitleX'>Status</TableCell>
              <TableCell className='TitleX'>Date</TableCell>
              <TableCell className='TitleX'>Error Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='DataX'>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell className='uploadId'>{log.upload_id}</TableCell>
                <TableCell className='filename'>{log.filename}</TableCell>
                <TableCell className='status'>{log.status}</TableCell>
                <TableCell className='date'>{new Date(log.uploaded_at).toLocaleDateString()}</TableCell>
                <TableCell className='errorDescription'>{log.error_description || 'N/A'}</TableCell> {/* Handle missing error descriptions */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Dashboard;
