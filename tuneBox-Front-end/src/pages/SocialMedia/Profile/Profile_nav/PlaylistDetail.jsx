import React, { useEffect, useState, useRef } from "react";
import {
  getPlaylistById,
  removeTrackFromPlaylist,
  getPlaylistByUserId,
} from "../../../../service/PlaylistServiceCus";
import { getTrackById } from "../../../../service/TrackServiceCus"; // Nhập khẩu hàm này
import "./css/playlistDetail.css";
import Cookies from "js-cookie";
import { images } from "../../../../assets/images/images";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getLikesCountByPlaylistId,
  checkUserLikePlaylist,
  removeLikePlaylist,
  addLikePlaylist,
} from "../../../../service/likeTrackServiceCus";
import { getUserInfo } from "../../../../service/UserService";
import Lottie from "lottie-react";
import SharePlaylistModal from "./SharePlaylistModal";
import { Link } from "react-router-dom";

const PlayListDetail = () => {
  const { id } = useParams();
  const userId = Cookies.get("userId");
  const [allplaylists, setAllPlaylists] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackDetails, setTrackDetails] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [trackDurations, setTrackDurations] = useState([]);
  const [IDTrack, setIDTrack] = useState("");
  const [currentTrackName, setCurrentTrackName] = useState("");
  const [currentImageTrack, setCurrentImageTrack] = useState("");
  const [userNamePlaylist, setUserName] = useState("");
  const [creatorIdPlaylist, setCreatorIdPlaylist] = useState("");
  const [userImg, setUserImg] = useState("");

  const [likesCount, setLikesCount] = useState(0);
  const [statusliked, setStatusLiked] = useState(false);

  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // animation Lottie
  const [animationData, setAnimationData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://lottie.host/4e8622cb-39bc-4ebe-99f7-1859864b347d/0ax8kjT4X0.json"
      );
      const data = await response.json();
      setAnimationData(data);
    };

    fetchData();
  }, []);
  // animation Lottie

  useEffect(() => {
    fetchPlaylist();
    fetchListPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      console.log(id); // Kiểm tra ID playlist
      const response = await getPlaylistById(id);
      setPlaylist(response.data);
      console.log("respon palylít: ", response);
      setCreatorIdPlaylist(response.data.creatorId);
      const user = await getUserInfo(response.data.creatorId);
      setUserName(user.userName);
      setUserImg(user.avatar);
      console.log("username cua playlist: ", user);

      await fetchTrackDetails(response.data.tracks); // Gọi hàm fetchTrackDetails
      console.log(response.data); // Xem dữ liệu playlist

      //ktra luot like
      const likeCount = await getLikesCountByPlaylistId(id);
      setLikesCount(likeCount.data);
      console.log("likecount: ", likeCount.data);

      // kiem tra trạng thái like cua user với playlist
      const liked = await checkUserLikePlaylist(id, userId);
      setStatusLiked(liked.data);
      console.log("trạng thái like: ", liked.data);
    } catch (err) {
      setError(err.message || "Error fetching playlist data");
      toast.error("Failed to load playlist data");
    } finally {
      setLoading(false);
    }
  };

  const fetchListPlaylist = async () => {
    setIsLoading(true);
    try {
      const playlistResponse = await getPlaylistByUserId(creatorIdPlaylist);
      setAllPlaylists(playlistResponse);
      console.log("fetchListPlaylist creator: ", playlistResponse);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleLikePlaylist = async (id) => {
    console.log("statusliked: ", statusliked);
    try {
      if (statusliked) {
        // nếu đã thích, gọi hàm xóa like
        await removeLikePlaylist(userId, id);
        setStatusLiked(false);

        setLikesCount((prevCount) => prevCount - 1);
        console.log("Đã xóa like idplaylist:", id);
      } else {
        // nếu chưa thích, gọi hàm thêm like
        await addLikePlaylist(userId, id);
        setStatusLiked(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error(
        "Lỗi khi xử lý like:",
        error.response?.data || error.message
      );
    }
  };

  const handleRemoveTrack = async (playlistId, trackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this track from your playlist??"
    );
    if (!confirmDelete) return;

    try {
      const response = await removeTrackFromPlaylist(playlistId, trackId);
      await fetchPlaylist();
      toast.success(response);
    } catch (error) {
      alert("Failed! Please try again");
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

  const [isPlaying, setIsPlaying] = useState(false);
  const handleTrackChange = async (index) => {
    if (index < 0 || index >= trackDetails.length) return;

    // Nếu track được chọn là bài hiện tại và đang phát -> tạm dừng
    if (playingTrackIndex === index && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingTrackIndex(index);
      return;
    }

    // Cập nhật thông tin bài hát mới
    setIDTrack(trackDetails[index]?.id);
    setCurrentTrackIndex(index);
    setCurrentTrackName(trackDetails[index]?.name);
    setCurrentImageTrack(trackDetails[index].imageTrack);
    setPlayingTrackIndex(index);

    // Kiểm tra nếu track có status là true thì bỏ qua
    if (trackDetails[index]?.status === true) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    console.log("trackDetails[index] ", trackDetails[index].imageTrack);
    // Cập nhật src
    audioRef.current.src = trackDetails[index]?.trackFile;

    try {
      // Tải lại audio
      await audioRef.current.load(); // Chờ tải audio
      await audioRef.current.play(); // Phát audio sau khi đã tải
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio");
      setIsPlaying(false);
      console.log(
        "Current Track Audio File: ",
        trackDetails[currentTrackIndex]?.audioFile
      );
    }
  };

  const togglePlayPause = async () => {
    // Nếu không có bài hát nào đang phát
    if (playingTrackIndex === null) {
      // Đặt chỉ số bài hát đầu tiên
      setPlayingTrackIndex(0);
      setCurrentTrackIndex(0);
      setCurrentTrackName(trackDetails[0]?.name);
      setCurrentImageTrack(trackDetails[0]?.imageTrack);
      audioRef.current.src = trackDetails[0]?.trackFile;

      try {
        await audioRef.current.load(); // Chờ tải audio
        await audioRef.current.play(); // Phát audio
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio");
        setIsPlaying(false);
      }
    } else if (isPlaying) {
      // Nếu bài hát đang phát, tạm dừng nó
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Nếu bài hát không phát, tiếp tục phát
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error resuming audio:", error);
        toast.error("Failed to resume audio");
      }
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

  const handleRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * trackDetails.length);
    handleTrackChange(randomIndex); // Gọi hàm phát bài theo chỉ số ngẫu nhiên
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!playlist) return <div className="p-4">No album data found</div>;

  return (
    <div className="content-audio">
      <div className="music-background">
        <div className="title-detail">My Playlist</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9833;</div>
        <div className="note">&#9839;</div>
        <div className="note">&#9834;</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9839;</div>
        <div className="note">&#9833;</div>
        <div className="note">&#9834;</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9839;</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9833;</div>
        <div className="note">&#9839;</div>
        <div className="note">&#9834;</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9839;</div>
        <div className="note">&#9833;</div>
        <div className="note">&#9834;</div>
        <div className="note">&#9835;</div>
        <div className="note">&#9839;</div>
        <ToastContainer position="top-right" />
        <div className="" style={{ marginLeft: "140px" }}>
          <div className="row">
            <div className="col-9">
              <div className="album-info">
                <div className="album-info-cover">
                  <div className="album-info-img">
                    <img
                      src={playlist.imagePlaylist || ""}
                      className="album-avatar"
                      alt="Album Cover"
                    />
                    {/* 
                    <img
                      src={playlist.imagePlaylist || ""}
                      className={`ImageTrack-audio ${
                        isPlaying ? "rotating-image" : ""
                      }`}
                      alt="Track Image"
                    /> */}
                    <button
                      className="player-audio-button"
                      onClick={togglePlayPause}
                    >
                      <i
                        className={`fa-solid fa-signal music-wave-icon ${
                          playingTrackIndex === currentTrackIndex && isPlaying
                            ? "playing"
                            : ""
                        }`}
                      ></i>
                    </button>
                  </div>
                  <div className="album-info-description">
                    <div className="album-name">{playlist.title}</div>
                    <div className="author">
                      <img src={userImg} className="user-ava"></img>
                      {userNamePlaylist || "Gia Nhu"}
                    </div>
                    <div className="album-description">
                      {playlist.description || "No description available."}
                    </div>
                    <div className="album-information">
                      <div className="info-date">
                        {playlist.createDate || "Date not available"}
                      </div>
                      <div className="info-type">
                        .{playlist.type || "Type not available"}
                      </div>
                    </div>
                  </div>
                  <div className="animation">
                    {/* {animationData && (
                      <Lottie animationData={animationData} loop={true} />
                    )} */}
                  </div>
                </div>
                <div className="album-info-actions">
                  <div>
                    <button
                      className="btn"
                      onClick={() => handleLikePlaylist(id)}
                    >
                      {likesCount}
                      <i
                        className={`fa-solid fa-heart ${
                          statusliked ? "text-danger" : "text-muted"
                        }`}
                        style={{ cursor: "pointer", fontSize: "20px" }}
                      ></i>
                    </button>
                    <button
                      className="btn"
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      <i
                        type="button"
                        style={{ fontSize: "20px", color: "white" }}
                        className="fa-solid fa-share mt-1"
                      ></i>
                    </button>
                    <SharePlaylistModal
                      playlistId={playlist.id}
                      isOpen={isShareModalOpen}
                      onClose={() => setIsShareModalOpen(false)}
                    />
                  </div>
                </div>
              </div>

              {/* List nhạc  */}
              <div className="album-track">
                <div className="list-track">
                  {/* Hiển thị danh sách track đã thêm */}
                  <table className="tableA">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Actions</th> {/* Thêm cột cho hành động phát */}
                        {String(playlist.creatorId) === String(userId) && (
                          <th>Remove</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {trackDetails.map((track, index) => (
                        <tr
                          key={track.id}
                          className={`${track.status ? "track-disabled" : ""} ${
                            currentTrackIndex === index ? "current-track" : ""
                          }`}
                          style={{ opacity: track.status ? 0.5 : 1 }} // Làm mờ track nếu có status = true
                        >
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
                            {track.status ? (
                              <span>Không còn tồn tại</span>
                            ) : (
                              <button
                                className="player-track-button custom-button"
                                onClick={() => handleTrackChange(index)}
                                disabled={track.status} // Disable nút phát nếu track bị vô hiệu hóa
                              >
                                <i
                                  className={`fa-solid ${
                                    playingTrackIndex === index && isPlaying
                                      ? "fa-pause"
                                      : "fa-play"
                                  }`}
                                ></i>
                              </button>
                            )}
                          </td>
                          {String(playlist.creatorId) === String(userId) && (
                            <td>
                              <a
                                href="#"
                                onClick={() =>
                                  handleRemoveTrack(playlist.id, track.id)
                                }
                              >
                                X
                              </a>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="orther">Orther playlist</div>
              <div>
                {isLoading && <p>Loading...</p>}
                <div className="playlist-container">
                  {allplaylists
                    .filter((list) => list.id !== playlist.id && !list.status)
                    .slice(0, 3) // Lấy 3 playlist đầu tiên
                    .map((playlist, index) => (
                      <div key={index} className="card-orther text-bg-dark">
                        <img
                          src={
                            playlist.imagePlaylist ||
                            "/src/assets/images/nai.jpg"
                          }
                          className="card-orther-img"
                        />
                        <div className="card-img-overlay">
                          <h6>{playlist.title}</h6>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* audio */}
        <div className="audio-player">
          <div className="row">
            <div className="col-3">
              <p className="title-audio">
                <img
                  src={currentImageTrack || playlist.imagePlaylist}
                  className={`ImageTrack-audio ${
                    isPlaying ? "rotating-image" : ""
                  }`}
                  alt="Track Image"
                />

                {trackDetails[currentTrackIndex]?.status ? (
                  <span
                    onClick={() => alert("Track no longer exists!.")}
                    style={{ cursor: "not-allowed", color: "grey" }}
                  >
                    {currentTrackName || "No song selected"}
                  </span>
                ) : (
                  <Link
                    to={{
                      pathname: `/track/${IDTrack}`,
                      state: { IDTrack },
                    }}
                  >
                    {currentTrackName || "No song selected"}
                  </Link>
                )}
              </p>
            </div>
            <div className="col-1">
              <div className="track-controls mt-3">
                <button
                  className="fa-solid fa-arrow-left custom-button"
                  onClick={handlePreviousTrack}
                  disabled={currentTrackIndex === 0}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    marginRight: "15px",
                  }}
                ></button>

                <button
                  className="fa-solid fa-random custom-button"
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    margin: "0 15px",
                  }}
                  onClick={handleRandomTrack}
                ></button>
                <button
                  className="fa-solid fa-arrow-right custom-button"
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    marginLeft: "15px",
                  }}
                  onClick={handleNextTrack}
                  disabled={currentTrackIndex === trackDetails.length - 1}
                ></button>
              </div>
            </div>
            <div className="col-6">
              <audio
                ref={audioRef}
                src={trackDetails[currentTrackIndex]?.trackFile}
                onEnded={handleAudioEnded}
                controls
                onPlay={() => {
                  // ktra track status trước khi phát nhạc
                  if (!trackDetails[currentTrackIndex]?.status) {
                    setIsPlaying(true);
                    setPlayingTrackIndex(currentTrackIndex);
                    setCurrentTrackName(trackDetails[currentTrackIndex]?.name);
                    setCurrentImageTrack(
                      trackDetails[currentTrackIndex]?.imageTrack
                    );
                  } else {
                    audioRef.current.pause();
                    alert("Track no longer exists!");
                  }
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setPlayingTrackIndex(null);
                }}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayListDetail;
