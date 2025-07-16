import React, { useState, useRef } from 'react';

const ScanAnimal = () => {
  const [result, setResult] = useState(''); // Holds prediction result
  const [isLoading, setIsLoading] = useState(false); // Tracks if prediction is in progress
  const [error, setError] = useState(''); // Holds error message
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the camera feed
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setError('Error accessing camera: ' + err.message);
      });
  };

  // Capture the image from the video feed
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    uploadImage(dataUrl);
  };

  // Convert data URL to Blob for uploading
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  // Upload the captured image for prediction
  const uploadImage = async (dataUrl) => {
    const blob = dataURItoBlob(dataUrl);
    const formData = new FormData();
    formData.append('file', blob, 'scan.jpg'); // Append the blob as a file

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

  // Start the camera when the component mounts
  React.useEffect(() => {
    startCamera();
    return () => {
      // Cleanup the video stream when the component unmounts
      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  return (
    <div>
      <h1>Scan Animal</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <video
          ref={videoRef}
          width="640"
          height="480"
          autoPlay
          muted
          style={{ border: '1px solid black' }}
        />
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      </div>
      <button onClick={captureImage} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Capture and Predict'}
      </button>
      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default ScanAnimal;
