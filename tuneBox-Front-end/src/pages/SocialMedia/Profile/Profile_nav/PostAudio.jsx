import React, { useState } from 'react';
import axios from 'axios';

const PostAudio = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
    
        try {
            const response = await axios.post('http://localhost:8080/profileUser/track/music', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };
    

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Music</button>
        </div>
    );
};

export default PostAudio;
