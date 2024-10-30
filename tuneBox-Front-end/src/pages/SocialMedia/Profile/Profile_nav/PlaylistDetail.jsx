import React, { useEffect, useState, useRef } from "react";
import { getPlaylistById } from "../../../../service/PlaylistServiceCus";
import { getTrackById } from "../../../../service/TrackServiceCus"; // Nhập khẩu hàm này
import "./css/albumDetail.css";
import { images } from "../../../../assets/images/images";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlayListDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackDetails, setTrackDetails] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [trackDurations, setTrackDurations] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        console.log(id); // Kiểm tra ID album
        const response = await getPlaylistById(id);
        setPlaylist(response.data);
        await fetchTrackDetails(response.data.tracks); // Gọi hàm fetchTrackDetails
        console.log(response.data); // Xem dữ liệu album
      } catch (err) {
        setError(err.message || "Error fetching playlist data");
        toast.error("Failed to load playlist data");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  // Fetch Track Details
  const fetchTrackDetails = async (trackIds) => {
    if (!trackIds || trackIds.length === 0) return; // Kiểm tra trackIds có tồn tại không
    try {
      const trackPromises = trackIds.map((id) => getTrackById(id));
      const trackResults = await Promise.all(trackPromises);
      console.log("Track Results: ", trackResults);
      setTrackDetails(trackResults.map((result) => result.data));

      // Tính toán thời gian cho từng track
      const durations = await Promise.all(
        trackResults.map(async (result) => {
          const duration = await calculateTrackDuration(result.data.trackFile);
          return duration;
        })
      );
      setTrackDurations(durations);
    } catch (error) {
      console.error("Error fetching track details:", error);
      toast.error("Failed to fetch track details");
    }
  };

  // Hàm để tính thời gian của từng track
  const calculateTrackDuration = (trackFile) => {
    return new Promise((resolve) => {
      const audio = new Audio(trackFile);
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
    });
  }; //sử dụng HTML5 Audio API:  sự kiện loadedmetadata để lấy thời gian của tệp âm thanh khi nó được tải xong

  // Hàm chuyển đổi giây thành phút:giây
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleTrackChange = async (index) => {
    // Chỉ cập nhật nếu index hợp lệ
    if (index < 0 || index >= trackDetails.length) return;

    setCurrentTrackIndex(index);

    // Cập nhật src
    audioRef.current.src = trackDetails[index]?.trackFile;

    try {
      // Tải lại audio
      await audioRef.current.load(); // Chờ tải audio
      await audioRef.current.play(); // Phát audio sau khi đã tải
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio");
      console.log(
        "Current Track Audio File: ",
        trackDetails[currentTrackIndex]?.audioFile
      );
    }
  };

  const handleAudioEnded = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex + 1; // Chuyển sang bài tiếp theo
      if (nextIndex < trackDetails.length) {
        // Kiểm tra xem chỉ số tiếp theo có hợp lệ không
        handleTrackChange(nextIndex);
        return nextIndex;
      } else {
        return prevIndex; // Dừng lại ở bài cuối
      }
    });
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex; // Không chuyển nếu đã ở bài đầu
      handleTrackChange(newIndex); // Gọi hàm phát bài
      return newIndex; // Cập nhật chỉ số bài nhạc hiện tại
    });
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex =
        prevIndex < trackDetails.length - 1 ? prevIndex + 1 : prevIndex; // Không chuyển nếu đã ở bài cuối
      handleTrackChange(newIndex); // Gọi hàm phát bài
      return newIndex; // Cập nhật chỉ số bài nhạc hiện tại
    });
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!playlist) return <div className="p-4">No album data found</div>;

  return (
    <div className="container">
      <ToastContainer position="top-right" />
      <div>
        <div className="album-info">
          <div className="album-info-cover">
            <div className="album-info-img">
              <img
                src={playlist.imagePlaylist || ""}
                className="album-avatar"
                alt="Album Cover"
              />
              <button
                className="player-audio-button"
                onClick={() => handleTrackChange(0)}
              >
                ▶
              </button>
            </div>
            <div className="album-info-description">
              <div className="album-name">{playlist.title}</div>
              <div className="author">{playlist.creatorId || "Gia Nhu"}</div>
              <div className="album-description">
                {playlist.description || "No description available."}
              </div>
              <div className="album-information">
                <div className="info-date">
                  {playlist.createDate || "Date not available"}
                </div>
                <div className="info-type">
                  {playlist.type || "Type not available"}
                </div>
              </div>
            </div>
          </div>
          <div className="album-info-actions">
            <div>
              <button className="btn">
                <img src={images.heart} className="btn-icon" alt="Like" />0
              </button>
              <button className="btn">
                <img
                  src={images.conversstion}
                  className="btn-icon"
                  alt="Share"
                />
                1
              </button>
            </div>
            <div className="default">
              <div className="btn-group" style={{ marginLeft: 25 }}>
                <button
                  className="btn dropdown-toggle no-border"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu dropdown-menu-lg-end">
                  <li>
                    <a className="dropdown-item">Edit</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Delete</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="album-track">
          <div className="list-track">
            {/* Hiển thị danh sách track đã thêm */}
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Actions</th> {/* Thêm cột cho hành động phát */}
                </tr>
              </thead>
              <tbody>
                {trackDetails.map((track, index) => (
                  <tr key={track.id}>
                    <td>{index + 1}</td>
                    <td>{track.name}</td>
                    <td>{track.description}</td>
                    <td>
                      {trackDurations[index]
                        ? formatDuration(trackDurations[index])
                        : "Loading..."}
                    </td>
                    {/* Hiển thị thời gian */}
                    <td>
                      <button
                        className="player-track-button"
                        onClick={() => handleTrackChange(index)}
                      >
                        ▶
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="audio-player">
        <div className="track-controls">
          <button
            className="btn"
            onClick={handlePreviousTrack}
            disabled={currentTrackIndex === 0}
          >
            Previous
          </button>
          <button
            className="btn play-track"
            onClick={() => handleTrackChange(currentTrackIndex)}
          >
            ▶
          </button>
          <button
            className="btn"
            onClick={handleNextTrack}
            disabled={currentTrackIndex === trackDetails.length - 1}
          >
            Next
          </button>
        </div>
        <audio
          ref={audioRef}
          src={trackDetails[currentTrackIndex]?.trackFile}
          onEnded={handleAudioEnded}
          controls
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

export default PlayListDetail;
