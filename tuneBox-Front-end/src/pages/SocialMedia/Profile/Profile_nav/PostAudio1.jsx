import React, { useState } from 'react';

const PostAudio = () => {
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu ở đây
    console.log({
      description,
      selectedOption,
      isPublic,
      selectedFile,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="border p-4 rounded" style={{ width: '400px' }}>
        <h4 className="mb-4 text-center">Publish Track</h4>

        {/* File Input */}
        <div className="mb-3">
          <label htmlFor="fileInput" className="form-label">Track File</label>
          <input
            className="form-control"
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name Track</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=""
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Track description"
            rows="5"
            required
          />
        </div>

        {/* Dropdown */}
        <div className="mb-3">
          <label htmlFor="trackType" className="form-label">Genre</label>
          <select
            className="form-select"
            id="trackType"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            required
          >
            <option value="">Other</option>
            <option value="single">Single</option>
            <option value="album">Album</option>
            <option value="mixtape">Mixtape</option>
          </select>
        </div>

        {/* Switch không up track lên feed */}
        <div className="mb-3 form-check form-switch p-0">
          <div className='row'>
            <div className='col-11 text-start'>
              <label className="form-check-label" htmlFor="publicSwitch">
                Unlisted
              </label>
            </div>
            <div className='col-1 text-end m-0'>
              <input
                className="form-check-input"
                type="checkbox"
                id="publicSwitch"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-50">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default PostAudio;
