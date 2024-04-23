import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomeOutput() {
  const [files, setFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');

  // Function to fetch files from the server when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Function to handle opening a file
  const handleOpenFile = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${fileId}`);
      setSelectedFileContent(response.data.content);
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Error opening file. Please try again.');
    }
  };

  return (
    <div>
      <h1>Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <strong>Filename:</strong> {file.filename},{' '}
            <strong>Language:</strong> {file.language}{' '}
            <button onClick={() => handleOpenFile(file._id)}>Open</button>
          </li>
        ))}
      </ul>
      {selectedFileContent && (
        <div>
          <h2>Selected File Content</h2>
          <pre>{selectedFileContent}</pre>
        </div>
      )}
    </div>
  );

  //<Link to="/home">home</Link>
}

export default HomeOutput;
