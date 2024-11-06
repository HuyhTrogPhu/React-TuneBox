import React, { useEffect, useState } from "react";
import "./css/albumNew.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  listTrackByUserId,
  listGenre,
  listAlbumStyle,
  createAlbum,
} from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toastify
import { images } from "../../../../assets/images/images";
import { useNavigate } from "react-router-dom";

const AlbumNew = () => {
  const navigate = useNavigate();
  const userId = Cookies.get("userId");
  const steps = ["Info", "Track"]; // tên các bước
  const [albumImageUrl, setAlbumImageUrl] = useState(images.musicalNote); // Khởi tạo với hình ảnh mặc định

  // gtri stepper
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  // luu tru giatri cac input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]); // list Genre
  const [type, setType] = useState([]);
  const [albumImage, setAlbumImage] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState(""); // lưu ID của genre được chọn
  const [selectedType, setSelectedType] = useState(""); // lưu ID của album style được chọn

  const [tracks, setTracks] = useState([]); //List track của user

  const [addedTracks, setAddedTracks] = useState([]); // List track đã thêm vào album

  // const [loading, setLoading] = useState(true);  //  trạng thái chờ
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    genre: "",
    type: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lưu trữ file hình ảnh được chọn
    if (file) {
      setAlbumImage(file); // Lưu trữ file để gửi khi tạo album
      setAlbumImageUrl(URL.createObjectURL(file)); // Tạo URL tạm thời cho hình ảnh
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchGenres(); // Gọi hàm lấy danh sách thể loại
    fetchType();
  }, [userId]);

  // Lấy type
  const fetchType = async () => {
    try {
      const typeResponse = await listAlbumStyle(); // Assuming listGenre is your API call
      console.log("fetchTypeAlbum in createAlbum", typeResponse);
      setType(typeResponse); // Store the fetched genres in state
    } catch (error) {
      console.log("Error fetching TypeALbum:", error);
    }
  };

  // Lấy Genre
  const fetchGenres = async () => {
    try {
      const genreResponse = await listGenre(); // Assuming listGenre is your API call
      console.log("fetchGenres in createAlbum", genreResponse);
      setGenres(genreResponse); // Store the fetched genres in state
    } catch (error) {
      console.log("Error fetching genres:", error);
    }
  };

  // Load List Track
  const fetchTracks = async () => {
    try {
      const response = await listTrackByUserId(userId);
      setTracks(response);
      const filteredTracks = response.filter((track) => track.status === false); // Lọc các track có status
      setFilteredTracks(response);
      console.log("fetchTrack in create album: ", filteredTracks);
    } catch (error) {
      console.error("fetchTrachs error:", error);
    }
  };

  // Lưu Track khi nhấn add
  const handleAddTrack = (track) => {
    if (!addedTracks.some((addedTrack) => addedTrack.id === track.id)) {
      setAddedTracks((prevTracks) => [...prevTracks, track]);
    }
  };
  // Xóa track khi nhấn remove
  const handleRemoveTrack = (trackId) => {
    setAddedTracks((prevTracks) =>
      prevTracks.filter((track) => track.id !== trackId)
    );
  };

  // Hàm create album
  const handleAddAlbum = async (e) => {
    // e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();

      // Append basic information
      formData.append("title", title);
      formData.append("albumImage", albumImage);
      formData.append("description", description);
      formData.append("status", "false");
      formData.append("report", "false");

      // Append IDs instead of objects

      formData.append("genre", Number(selectedGenre)); // ID của genre
      formData.append("user", Number(userId)); // ID của user
      formData.append("albumStyle", Number(selectedType)); // ID của albumStyle

      // Handle track IDs
      if (addedTracks.length > 0) {
        const trackIds = addedTracks.map((track) => track.id);
        formData.append("trackIds", trackIds); // Gửi trực tiếp như một mảng
        console.log("Track IDs add:", trackIds);
      }

      try {
        // Debug log before sending
        console.log("Form Data Contents:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await createAlbum(formData);
        console.log("Album created successfully:", response);
        toast.success("Album created successfully!");

        // Chuyển hướng đến trang album chi tiết
        navigate(`/album/${response.id}`);

        // Reset form after successful creation
        setTitle("");
        setDescription("");
        setAlbumImage(null);
        setAlbumImageUrl(images.musicalNote);
        setSelectedGenre("");
        setSelectedType("");
        setAddedTracks([]);
        setActiveStep(0);
      } catch (error) {
        console.error("Failed to create album:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to create album. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      title: "",
      description: "",
      genre: "",
      type: "",
      albumImage: "",
    };

    if (!title) {
      newErrors.title = "Album title is required.";
      valid = false;
    }

    if (!albumImage) {
      newErrors.albumImage = "Album image is required.";
      valid = false;
    }

    if (!description) {
      newErrors.description = "Description is required.";
      valid = false;
    } else if (description.length < 10 || description.length > 1000) {
      newErrors.description =
        "Description must be between 10 and 1000 characters.";
      valid = false;
    }

    if (!selectedGenre) {
      newErrors.genre = "Please select a genre.";
      valid = false;
    }

    if (!selectedType) {
      newErrors.type = "Please select an album type.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // control Stepper
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    if (validateForm()) {
      let newSkipped = skipped;

      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  //end control Stepper

  // search
  const [keyword, setKeyword] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);

  // Hàm xử lý tìm kiếm và lọc danh sách track
  const handleSearch = (e) => {
    const searchKeyword = e.target.value; //từ khóa tìm kiếm từ input
    setKeyword(searchKeyword); // update state từ khóa tìm kiếm

    // từ khóa trống, hiển thị tất cả track
    if (!searchKeyword.trim()) {
      setFilteredTracks(tracks);
      return;
    }

    // lọc danh sách track theo từ khóa
    const filtered = tracks.filter((track) =>
      track.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredTracks(filtered); // Cập nhật danh sách track đã lọc
  };
  // end search

  return (
    <div className="container">
      <ToastContainer />
      {/* Header */}
      <div className="header">
        <h2 className="header-title mb-4">New Album</h2>
        <div className="header-step">
          <Box sx={{ width: "100%" }}>
            <Box className="stepper-container">
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={
                      activeStep === steps.length - 1
                        ? handleAddAlbum
                        : handleNext
                    }
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>
      </div>

      {/* Content */}
      <div className="album-create-card p-5 border rounded-4">
        {activeStep === 0 && ( // Bước 1: Thông tin album
          <div className="album-create-info">
            {/* <h5 className="text-center mb-5">Album Information</h5> */}

            <div className="info-img me-5">
              <img
                src={albumImageUrl} // Sử dụng URL tạm thời để hiển thị hình ảnh
                className="avatar border"
                alt="Avatar"
              />

              <input
                type="file"
                className="form-control"
                accept="image/*" // Chỉ cho phép chọn hình ảnh
                onChange={handleImageChange} // Gọi hàm xử lý khi người dùng chọn file
              />
              {errors.albumImage && (
                <span className="text-danger">{errors.albumImage}</span>
              )}
            </div>

            <div className="info-form ms-5">
              <form className="row" onSubmit={handleAddAlbum}>
                {/* Title */}
                <div className="form-default">
                  <label className="form-label">Album title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <span className="text-danger">{errors.title}</span>
                  )}
                </div>
                {/* Description */}
                <div className="form-default mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    type="text"
                    cols="50"
                    rows="5"
                    className="form-control custom-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {errors.description && (
                    <span className="text-danger">{errors.description}</span>
                  )}
                </div>
                {/* Genre */}
                <div className="mt-3 d-flex align-items-center">
                  <div className="flex-fill me-2">
                    <label className="form-label">Genre</label>
                    <select
                      className="form-select"
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)} // Cập nhật genre được chọn
                    >
                      <option value="" disabled>
                        Select genre
                      </option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    {errors.genre && (
                      <span className="text-danger">{errors.genre}</span>
                    )}
                  </div>
                  <div className="flex-fill ms-3">
                    <label className="form-label">Album type</label>
                    <select
                      className="form-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)} // Cập nhật album type được chọn
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      {type.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <span className="text-danger">{errors.type}</span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeStep === 1 && ( // Bước 2: Thêm track
          <div className="album-create-add-track">
            <h5 className="text-center mb-5">Add Tracks</h5>
            <div className="track-container">
              {/* Danh sách các track  */}
              <div className="list-track">
                {/* search */}
                <div className="search-container mb-5">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={keyword}
                    onChange={handleSearch} // Gọi handleSearch khi người dùng nhập
                  />
                  <button type="button" className="btn-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
                {/* list */}
                {filteredTracks.map(
                  (track) =>
                    !track.status &&
                    !addedTracks.some(
                      (addedTrack) => addedTrack.id === track.id
                    ) && (
                      <div key={track.id} className="post-header-track m-5">
                        <img
                          src={track.imageTrack}
                          className="avatar_small"
                          alt="Track 1"
                        />
                        <div className="info">
                          <div className="name">{track.name}</div>

                          <div className="author">{track.genreName}</div>
                        </div>
                        <div className="btn-group" style={{ marginLeft: 25 }}>
                          <button
                            type="button"
                            className="btn-new rounded-5"
                            onClick={() => handleAddTrack(track)}
                          >
                            add
                          </button>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="list-add-track">
                {/* Hiển thị danh sách track đã thêm */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedTracks.map((addedTrack) => (
                      <tr key={addedTrack.id}>
                        <td>{addedTrack.name}</td>
                        <td>{addedTrack.description}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => handleRemoveTrack(addedTrack.id)} // Hàm để xử lý xóa
                          >
                            x
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/*  */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumNew;
