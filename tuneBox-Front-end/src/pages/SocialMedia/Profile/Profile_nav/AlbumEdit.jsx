import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/albumEdit.css";
import {
  getAlbumById,
  listGenre,
  listAlbumStyle,
  updateAlbum,
} from "../../../../service/AlbumsServiceCus";
import { getTrackById } from "../../../../service/TrackServiceCus";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlbumEdit = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const userId = Cookies.get("UserID");

  // State Management
  const [album, setAlbum] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [trackDetails, setTrackDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [type, setType] = useState([]);
  const [albumImage, setAlbumImage] = useState(null);
  const [albumImageUrl, setAlbumImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumResponse, genreResponse, typeResponse] = await Promise.all([
          getAlbumById(albumId),
          listGenre(),
          listAlbumStyle()
        ]);

        if (albumResponse?.data) {
          setAlbum(albumResponse.data);
          setSelectedGenre(albumResponse.data.genreId);
          setSelectedType(albumResponse.data.albumStyleId);
          setAlbumImageUrl(albumResponse.data.albumImage);
          await fetchTrackDetails(albumResponse.data.tracks);
        } else {
          setError("Album data not found");
        }

        setGenres(genreResponse);
        setType(typeResponse);

      } catch (err) {
        setError(err.message || "Error fetching album data");
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load album data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albumId]);

  // Fetch Track Details
  const fetchTrackDetails = async (trackIds) => {
    try {
      const trackPromises = trackIds.map((id) => getTrackById(id));
      const trackResults = await Promise.all(trackPromises);
      setTrackDetails(trackResults.map((result) => result.data));
    } catch (error) {
      console.error("Error fetching track details:", error);
      toast.error("Failed to fetch track details");
    }
  };

  // Handle Track Removal
  const handleRemoveTrack = (trackId) => {
    setTrackDetails(trackDetails.filter((track) => track.id !== trackId));
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      tracks: prevAlbum.tracks.filter((id) => id !== trackId),
    }));
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "genre") {
      setSelectedGenre(value);
    } else if (name === "type") {
      setSelectedType(value);
    }
    
    setAlbum((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setAlbumImage(file);
      setAlbumImageUrl(URL.createObjectURL(file));
    }
  };

  // Form Validation
  const validateForm = () => {
    if (!album.title?.trim()) {
      toast.error("Album title is required");
      return false;
    }

    if (!selectedGenre) {
      toast.error("Please select a genre");
      return false;
    }

    if (!selectedType) {
      toast.error("Please select an album type");
      return false;
    }

    if (!album.description?.trim()) {
      toast.error("Album description is required");
      return false;
    }

    return true;
  };

// Handle Album Update
const handleEditAlbum = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const formData = new FormData();

    // Append basic information
    formData.append("title", album.title.trim());
    formData.append("description", album.description.trim());
    formData.append("status", album.status);
    formData.append("report", album.report);
    formData.append("userId", userId);

    // Handle image
    if (albumImage) {
      formData.append("albumImage", albumImage);
    } else if (albumImageUrl) {
      formData.append("albumImage", albumImageUrl);
    }

    // Handle IDs with type conversion
    formData.append("genreId", Number(selectedGenre));
    formData.append("albumstyleId", Number(selectedType));

    // Handle tracks by appending each track ID separately
    trackDetails.forEach((track) => {
      formData.append("trackIds", Number(track.id)); // Gửi từng track ID
    });

    // Debug logging
    console.log("Updating album with data:", {
      title: album.title,
      genreId: selectedGenre,
      albumStyleId: selectedType,
      trackIds: trackDetails.map((track) => track.id), // Chỉ để kiểm tra
      hasNewImage: !!albumImage
    });

    const response = await updateAlbum(albumId, formData);
    console.log("Album update response:", response);
    
    toast.success("Album updated successfully!");
    navigate(`/album/${albumId}`);

  } catch (error) {
    console.error("Failed to update album:", error);
    console.error("Error response:", error.response);
    
    // Handle specific error cases
    if (error.response?.status === 413) {
      toast.error("File size too large");
    } else if (error.response?.status === 415) {
      toast.error("Unsupported file type");
    } else {
      toast.error(error.response?.data?.message || "Failed to update album");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!album) return <div className="p-4">No album data found</div>;

  return (
    <div className="container">
      <ToastContainer position="top-right" />
      <div className="row">
        <div className="col-2">
          <div className="album-nav">
            <p className="mb-5">Back to album</p>
          </div>
          <ul className="nav nav-tabs flex-column" id="albumTab" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                id="info-tab"
                data-bs-toggle="tab"
                href="#info"
                role="tab"
                aria-controls="info"
                aria-selected="true"
              >
                Info
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                id="tracks-tab"
                data-bs-toggle="tab"
                href="#tracks"
                role="tab"
                aria-controls="tracks"
                aria-selected="false"
              >
                Tracks
              </a>
            </li>
          </ul>
        </div>

        <div className="content col-10">
          <h5 className="mb-5 mt-0">Album Setting</h5>
          <div className="album-create-card">
            <div className="tab-content" id="albumTabContent">
              {/* Info Tab */}
              <div
                className="tab-pane fade show active"
                id="info"
                role="tabpanel"
                aria-labelledby="info-tab"
              >
                <div className="album-create-info">
                  <div className="info-img me-5">
                    <img
                      src={albumImageUrl}
                      className="avatar border"
                      alt="Album cover"
                    />
                    <input
                      type="file"
                      className="form-control mt-3"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="info-form ms-5">
                    <form className="row">
                      <div className="form-default">
                        <label className="form-label">Album title *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={album.title || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-default mt-3">
                        <label className="form-label">Description *</label>
                        <textarea
                          name="description"
                          className="form-control custom-textarea"
                          value={album.description || ''}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        />
                      </div>
                      <div className="mt-3 d-flex align-items-center">
                        <div className="flex-fill me-2">
                          <label className="form-label">Genre *</label>
                          <select
                            name="genre"
                            className="form-select"
                            value={selectedGenre}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Genre</option>
                            {genres.map((genre) => (
                              <option key={genre.id} value={genre.id}>
                                {genre.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-fill ms-3">
                          <label className="form-label">Album type *</label>
                          <select
                            name="type"
                            className="form-select"
                            value={selectedType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Type</option>
                            {type.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn-update mt-5"
                    onClick={handleEditAlbum}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>

              {/* Tracks Tab */}
              <div
                className="tab-pane fade"
                id="tracks"
                role="tabpanel"
                aria-labelledby="tracks-tab"
              >
                <div className="album-create-add-track">
                  <div className="track-container">
                    <div className="list-add-track">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Track name</th>
                            <th>Description</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trackDetails.map((track) => (
                            <tr key={track.id}>
                              <td>{track.name}</td>
                              <td>{track.description}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-remove"
                                  onClick={() => handleRemoveTrack(track.id)}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumEdit;