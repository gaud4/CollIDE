import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomeOutput() {
  const [files, setFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileId, setSelectedFileId] = useState("");

  // Function to fetch files from the server when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  // Function to handle opening a file
  const handleOpenFile = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${fileId}`);
      //console.log(123);
      setSelectedFileContent(response.data.content);
      setSelectedFileId(fileId);
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Error opening file. Please try again.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      // Send a DELETE request to the server to delete the file by ID
      const response = await axios.delete(
        `http://localhost:5000/files/${fileId}`
      );
      alert("File deleted successfully!");

      if (selectedFileId === fileId) {
        setSelectedFileId("");
        setSelectedFileContent("");
      }

      // Optional: Update UI or state (e.g., refresh the file list)
      const update = await axios.get("http://localhost:5000/files");
      setFiles(update.data); // Uncomment if you have a function to refresh the file list
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  return (
    <div>
      <h1>Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <strong>room:</strong> {file.room},{" "}
            <button onClick={() => handleOpenFile(file._id)}>Open</button>
            &nbsp;&nbsp;
            <button onClick={() => handleDeleteFile(file._id)}>Delete</button>
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
