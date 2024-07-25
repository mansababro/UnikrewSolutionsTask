import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload as AntdUpload } from 'antd';
import axios from 'axios';
import './Upload.css';

const { Dragger } = AntdUpload;

const UploadSlip = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const props = {
    name: 'file',
    multiple: false, // Restrict to one file at a time
    action: '', // Set this to your server URL when implementing real upload
    showUploadList: false, // Hide the default upload list
    beforeUpload(file) {
      // Add file to the list
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    onRemove() {
      // Clear file list when removed
      setFileList([]);
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileList([]);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileList[0]);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        message.success('File uploaded and processed successfully.');
      } else {
        message.error(`Upload failed: ${response.data.error}`);
      }
    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setFileList([]);
    }
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
          <h5 className='uploadh5'>Files to be uploaded:</h5>
          <ul>
            {fileList.map(file => (
              <li key={file.uid} className='fileName'>{file.name}</li>
            ))}
          </ul>
          <Button
            type="primary"
            onClick={handleUpload}
            className='SubmitBtn'
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadSlip;
