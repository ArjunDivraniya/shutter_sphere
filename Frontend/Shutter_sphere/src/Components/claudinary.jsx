import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default"); // Try changing this if it still fails

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dncosrakg/image/upload",
        formData
      );

      setUploadedUrl(response.data.secure_url);
      console.log("Uploaded Image URL:", response.data.secure_url);
    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Upload failed! Error: ${error.response?.status} - ${error.response?.statusText}`);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ width: "300px", marginTop: "10px" }} />}
      <button onClick={handleUpload}>Upload to Cloudinary</button>
      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
