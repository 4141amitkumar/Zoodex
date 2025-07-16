import React, { useState } from 'react';
import './AnimalDetector.css';

const AnimalDetector = () => {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult('');
  };

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
        setResult('Error occurred while processing');
      }
    } catch (error) {
      console.error(error);
      setResult('Error occurred while making the request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animal-detector">
      <h2>Detect Animal</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Upload and Detect'}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default AnimalDetector;
