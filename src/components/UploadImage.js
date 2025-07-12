import React, { useState } from 'react';

function UploadImage({ onTextExtracted }) {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    setStatus('Extracting text from image...');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onTextExtracted(Array.isArray(data.lines) ? data.lines : []);
      setStatus('Text extracted successfully!');
    } catch (error) {
      setStatus('Error extracting text.');
      console.error('OCR error:', error);
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      <input type="file" accept="image/*" onChange={handleChange}
        style={{
        background: '#fff',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
        fontWeight: 'bold'
        }}
      />

    {image && (
      <p style={{ margin: '5px 0 15px 0', fontStyle: 'italic', color: '#ddd' }}>
      Selected file: {image.name}
      </p>
    )}


      <button onClick={handleUpload} style={{
        background: '#00e5ff',
        color: '#000',
        border: 'none',
        padding: '10px 20px',
        fontWeight: 'bold',
        borderRadius: '8px',
        marginLeft: '10px',
        cursor: 'pointer',
        transition: '0.2s ease-in-out'
     }}>
  Extract Text
</button>

      <p>{status}</p>
    </div>
  );
}

export default UploadImage;
