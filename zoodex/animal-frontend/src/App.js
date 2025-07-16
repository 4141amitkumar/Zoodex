import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AnimalDetector from './components/AnimalDetector';
import ScanAnimal from './components/ScanAnimal';
import './styles/App.css';

function App() {
  const [result, setResult] = useState(''); // Holds the result or error message
  const [isLoading, setIsLoading] = useState(false); // Tracks if the prediction process is in progress
  const [selectedFile, setSelectedFile] = useState(null); // Tracks the selected file
  const [imagePreview, setImagePreview] = useState(null); // Stores the preview URL of the selected image

  // Handles file selection and generates an image preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file); // Update the selected file
    setResult(''); // Reset the result when a new file is selected

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file); // Read the file as a data URL for preview
    } else {
      setImagePreview(null); // Reset the preview if no file is selected
    }
  };

  // Handles file upload and prediction
  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`Predicted animal: ${data.animal_name}`);
      } else {
        const errorData = await response.json();
        setResult(`Error: ${errorData.error || 'Unable to process the file'}`);
      }
    } catch (error) {
      setResult('Error occurred while making the request');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/detect"
            element={
              <div className="App">
                <h1>Animal Detector</h1>
                <div className="file-upload">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    aria-label="Select an image to detect the animal"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img
                        src={imagePreview}
                        alt="Selected preview"
                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                      />
                    </div>
                  )}
                  <button onClick={uploadFile} disabled={isLoading || !selectedFile}>
                    {isLoading ? 'Processing...' : 'Upload and Predict'}
                  </button>
                </div>
                {result && <p className="result">{result}</p>}
              </div>
            }
          />
          <Route path="/scan" element={<ScanAnimal />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
