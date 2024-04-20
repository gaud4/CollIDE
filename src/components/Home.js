import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('');
  const [content, setContent] = useState('');

  // Function to handle file creation
  const handleCreateFile = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/create',
        {
          filename,
          language,
          content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('File created successfully!');
      setFiles([...files, response.data]);
    } catch (error) {
      console.error('Error creating file:', error);
      alert('Error creating file. Please try again.');
    }
  };

  // Function to fetch files from the server
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Fetch files from the server when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Create Code File</h1>
      <form>
        <label htmlFor="filename">Filename:</label>
        <input
          type="text"
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          required
        />
        <br />
        <label htmlFor="language">Language:</label>
        <input
          type="text"
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        />
        <br />
        <label htmlFor="content">Code:</label>
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          cols="50"
          required
        ></textarea>
        <br />
        <button type="button" onClick={handleCreateFile}>
          Submit
        </button>
      </form>
      <h1>Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <strong>Filename:</strong> {file.filename},{' '}
            <strong>Language:</strong> {file.language}
          </li>
        ))}
      </ul>

      
        
            <Link to="/fileoutput">HomeOutput</Link>
        
      
    
    </div>
  );
}

export default Home;