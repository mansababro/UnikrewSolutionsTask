import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload as AntdUpload } from 'antd';
import axios from 'axios';
import './Upload.css';

const { Dragger } = AntdUpload;

const UploadSlip = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [filename, setFilename] = useState(''); // State to keep track of the filename

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload(file) {
      setFileList([file]);
      setFilename(file.name); // Save the filename
      return false;
    },
    onRemove() {
      setFileList([]);
      setFilename(''); // Clear the filename when file is removed
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleProcess = async () => {
    if (!fileList.length) {
      message.error('No file selected.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('filename', filename); // Include filename in form data

    // Save filename and date in localStorage
    const date = new Date().toISOString();
    localStorage.setItem('lastProcessedFile', filename);
    localStorage.setItem('lastProcessedDate', date);

    try {
      const response = await axios.post('http://localhost:5000/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        message.success('File processed successfully.');
        setProcessedFiles(response.data.files);
      } else {
        message.error(`Processing failed: ${response.data.error}`);
      }
    } catch (error) {
      message.error(`Processing failed: ${error.message}`);
    } finally {
      setUploading(false);
      setFileList([]);
      setFilename('');
    }
  };

  const handleSendAllEmails = async () => {
    const filenames = processedFiles;

    if (filenames.length === 0) {
      message.error('No files to send.');
      return;
    }

    try {
      // Send email functionality here
      await axios.post('http://localhost:5000/send-email', { filenames });
      message.info('Emails sent successfully.');
    } catch (error) {
      message.error(`Failed to send email: ${error.message}`);
    }
  };

  const handleDownload = (filename) => {
    const url = `http://localhost:5000/download/${filename}`;
    window.open(url, '_blank');
  };

  return (
    <div className="upload-container">
      <h4>Upload Employee Slip</h4>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single file upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>

      {fileList.length > 0 && (
        <div className="file-list">
          <h5 className='uploadh5'>Files to be processed:</h5>
          <ul>
            {fileList.map(file => (
              <li key={file.uid} className='fileName'>{file.name}</li>
            ))}
          </ul>
          <Button
            type="primary"
            onClick={handleProcess}
            className='SubmitBtn'
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Processing...' : 'Process'}
          </Button>
        </div>
      )}

      {processedFiles.length > 0 && (
        <div className="processed-files">
          <h5 className='uploadh5'>Processed Files:</h5>
          <ul>
            {processedFiles.map((file, index) => (
              <li key={index} className='fileName'>
                <a href="#" onClick={() => handleDownload(file)}>{file}</a>
              </li>
            ))}
          </ul>
          <Button
            type="primary"
            onClick={handleSendAllEmails}
            className='SendEmailBtn'
          >
            Send All Emails
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadSlip;
