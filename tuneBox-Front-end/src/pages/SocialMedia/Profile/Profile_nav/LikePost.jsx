import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { images } from "../../../../assets/images/images";
import {
  addLike,
  removeLikePost,
  checkUserLikeTrack,
  removeLike,
  getAllLikedByUser,
} from "../../../../service/likeTrackServiceCus";
import { getTrackById } from "../../../../service/TrackServiceCus";
import UsersToFollow from "../UsersToFollow";
import WaveFormFeed from "../../../SocialMedia/Profile/Profile_nav/WaveFormFeed";
import { ToastContainer, toast } from "react-toastify";
import {
  getPlaylistByUserId,
  getPlaylistById,
  updatePlaylist,
} from "../../../../service/PlaylistServiceCus";
import { Link } from "react-router-dom";

const LikePost = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = Cookies.get("userId");

  const [posts, setPosts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedTracks, setLikedTracks] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  const tokenjwt = localStorage.getItem("jwtToken");

  const fetchPostById = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/post/${postId}`
      );
      console.log("Error fetching post by ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLikedItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllLikedByUser(currentUserId);
        console.log("Response Data:", response);

        const fetchedPosts = [];
        const fetchedTracks = [];

        await Promise.all(
          response.map(async (item) => {
            try {
              if (item.trackId) {
                const trackResponse = await getTrackById(item.trackId);
                // Kiểm tra xem trackResponse có data không
                if (trackResponse && trackResponse.data) {
                  fetchedTracks.push(trackResponse.data);
                  await checkTrackLikeStatus(trackResponse.data.id); //kta
                }
              } else if (item.postId) {
                const postData = await fetchPostById(item.postId);
                if (postData) {
                  fetchedPosts.push(postData);
                  // Kiểm tra trạng thái like cho post
                  await checkPostLikeStatus(postData.id);
                }
              }
            } catch (itemError) {
              console.error(`Error fetching item ${item.id}:`, itemError);
            }
          })
        );

        setPosts(fetchedPosts);
        setTracks(fetchedTracks);
        console.log("Fetched Posts:", fetchedPosts);
        console.log("Fetched Tracks:", fetchedTracks);
      } catch (error) {
        console.error("Error fetching liked items:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchLikedItems();
    }
  }, [currentUserId]);

  // Kiểm tra trạng thái like cho track
  const checkTrackLikeStatus = async (trackId) => {
    try {
      const likeStatus = await checkUserLikeTrack(trackId, currentUserId);
      console.log(`Track ${trackId} like status:`, likeStatus); // Debug
      setLikedTracks((prev) => ({
        ...prev,
        [trackId]: { data: likeStatus?.data === true },
      }));
    } catch (error) {
      console.error(`Error checking like status for track ${trackId}:`, error);
    }
  };

  // Kiểm tra trạng thái like cho post
  const checkPostLikeStatus = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/post/${postId}/user/${currentUserId}`
      );
      console.log(`Post ${postId} like status:`, response.data); // Debug
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: { data: response.data === true },
      }));
    } catch (error) {
      console.error(`Error checking like status for post ${postId}:`, error);
    }
  };

  const handleLikeTrack = async (trackId) => {
    try {
      if (likedTracks[trackId]?.data) {
        await removeLike(currentUserId, trackId);
      } else {
        await addLike(currentUserId, trackId);
      }
      // Refresh like status
      await checkTrackLikeStatus(trackId);

      // Update track like count in the UI
      setTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.id === trackId
            ? {
                ...track,
                likeCount: likedTracks[trackId]?.data
                  ? track.likeCount - 1
                  : track.likeCount + 1,
              }
            : track
        )
      );
    } catch (error) {
      console.error("Error handling track like:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      if (likedPosts[postId]?.data) {
        await removeLikePost(currentUserId, postId);
      } else {
        await addLike(currentUserId, postId);
      }
      // Refresh like status
      await checkPostLikeStatus(postId);

      // Update post like count in the UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: likedPosts[postId]?.data
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling post like:", error);
    }
  };

  const handleAvatarClick = (post) => {
    console.log("Current User ID:", currentUserId);
    console.log("Post User ID:", post.userId);

    if (String(post.userId) === String(currentUserId)) {
      console.log("Navigating to ProfileUser");
      navigate("/profileUser");
    } else {
      console.log("Navigating to OtherUserProfile");
      navigate(`/profile/${post.userId}`);
    }
  };

  // playlist
  // list
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackToAddPlayList, setTrackToAddPlayList] = useState(null);

  const fetchListPlaylist = async () => {
    try {
      const playlistResponse = await getPlaylistByUserId(currentUserId);
      setPlaylists(playlistResponse);
      console.log("playlist  ", playlistResponse);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };
  const addToPlaylist = (trackId) => {
    setShowModal(true); // Mở modal
    setTrackToAddPlayList(trackId);
  };

  useEffect(() => {
    fetchListPlaylist();
  }, [currentUserId]);

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
  };
  const handleAddTrackToPlaylist = async (playlistId) => {
    try {
      // lấy thong tin htai cua lít
      const currentPlaylist = await getPlaylistById(playlistId);
      console.log("currentPlaylist: ", currentPlaylist.data);
      const formData = new FormData();
      // Kiểm tra xem track đã tồn tại trong playlist chưa
      const existingTracks = currentPlaylist.data.tracks; // Danh sách track hiện có trong playlist
      if (existingTracks.includes(trackToAddPlayList)) {
        toast.error("Track đã tồn tại trong playlist!");
        return; // Dừng thực hiện nếu track đã tồn tại
      }
      formData.append("trackIds", trackToAddPlayList);
      formData.append("title", currentPlaylist.data.title);
      formData.append("imagePlaylist", currentPlaylist.data.imagePlaylist); // thêm trường này
      formData.append("description", currentPlaylist.data.description);
      formData.append("status", false);
      formData.append("report", false);
      formData.append("type", currentPlaylist.data.type);
      formData.append("user", currentUserId);
      console.log("handleAddTrackToPlaylist: ", currentPlaylist.data.title);
      await updatePlaylist(playlistId, formData);
      toast.success(" Add Track to Playlist successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create add track to playlist:", error);
      const errorMessage =
        error.response?.data?.message || "Failed. Please try again.";
      toast.error(errorMessage);
    }
  };
  // end playlist

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading liked items</div>;

  return (
    <div className="likePost mt-5">
      <ToastContainer />
      <h1 className="search-results-title text-center mb-5">Liked Post</h1>
      <div className="row container-fluid">
        {/* trái */}
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <h1 className="search-results-title">Orther</h1>

            <li className="left mb-4">
              <Link to={"/likeAlbums"} className="d-flex align-items-center">
                <img
                  src={images.music}
                  alt="icon"
                  width={20}
                  className="me-2"
                />
                <span className="fw-bold">Albums đã thích</span>
              </Link>
            </li>

            <li className="left mb-4">
              <Link to={"/likePlaylist"} className="d-flex align-items-center">
                <img
                  src={images.playlist}
                  alt="icon"
                  width={20}
                  className="me-2"
                />
                <span className="fw-bold">Playlist đã thích</span>
              </Link>
            </li>
            <li className="left mb-4">
              <Link
                to={"/FriendRequests"}
                className="d-flex align-items-center"
              >
                <span className="fw-bold">Danh sách lời mời kết bạn</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* giữa */}
        <div className="post-list col-6 content">
          {/* track */}
          <div className="container mt-2 ">
            {tracks.map(
              (track) =>
                !track.status && (
                  <div className="post border" key={track.id}>
                    <div className="post-header position-relative">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleAvatarClick(track)}
                        aria-label="Avatar"
                      >
                        <img
                          src={track.avatar}
                          className="avatar_small"
                          alt="Avatar"
                        />
                      </button>
                      <div>
                        <div className="name">
                          {track.userNickname || "Unknown Track"}
                        </div>
                        <div className="time">
                          {new Date(track.createDate).toLocaleString()}
                        </div>
                      </div>

                      {/* Dropdown cho bài viết */}
                      {String(track.userId) === String(currentUserId) ? (
                        <div className="dropdown position-absolute top-0 end-0">
                          <button
                            className="btn btn-options dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton-${track.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          ></button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${track.id}`}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => addToPlaylist(track.id)}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>{" "}
                                Add to playlist
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="dropdown position-absolute top-0 end-0">
                          <ul>
                            <li>
                              <button
                                className="fa-regular fa-flag btn-report border border-0"
                                // onClick={() => handleReport(track.id, "track")}
                              ></button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => addToPlaylist(track.id)}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>{" "}
                                Add to playlist
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="post-content description">
                      {track.description || "No description"}
                    </div>

                    <div className="post-content audio">
                      <WaveFormFeed
                        audioUrl={track.trackFile}
                        track={track}
                        className="track-waveform"
                      />
                    </div>

                    <div className="row d-flex justify-content-start align-items-center">
                      <div className="col-2 mt-2 text-center">
                        <div className="like-count">
                          {track.likes.length || 0}
                          <i
                            className={`fa-solid fa-heart ${
                              likedTracks[track.id]?.data
                                ? "text-danger"
                                : "text-muted"
                            }`}
                            onClick={() => handleLikeTrack(track.id)}
                            style={{ cursor: "pointer", fontSize: "25px" }}
                          ></i>
                        </div>
                      </div>

                      {/* comment track -> trackDetail*/}
                      <div className="col-2 mt-2 text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <Link
                            to={{
                              pathname: `/track/${track.id}`,
                              state: { track },
                            }}
                          >
                            <i
                              type="button"
                              style={{ fontSize: "25px" }}
                              className="fa-regular fa-comment"
                              data-bs-toggle="modal"
                              data-bs-target="#modalComment"
                            ></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          {/* post */}
          <div className="container mb-5">
            {posts.map(
              (post) =>
                !post.status && (
                  <div className="post border" key={post.id}>
                    <div className="post-header position-relative">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleAvatarClick(post)}
                        aria-label="Avatar"
                      >
                        <img
                          src={post.avatar}
                          className="avatar_small"
                          alt="Avatar"
                        />
                      </button>
                      <div>
                        <div className="name">
                          {post.userNickname || "Unknown Track"}
                        </div>
                        <div className="time">
                          {new Date(post.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Dropdown cho bài viết */}
                      {String(post.userId) === String(currentUserId) ? (
                        <div className="dropdown position-absolute top-0 end-0">
                          <button
                            className="btn btn-options dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton-${post.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            ...
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${post.id}`}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleEditPost(post)}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <i className="fa-solid fa-trash "></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button
                          className="fa-regular fa-flag btn-report position-absolute top-0 end-0 border border-0"
                          onClick={() => handleReport(post.id, "post")}
                        ></button>
                      )}
                    </div>

                    <div className="post-content ">
                      {post.content || "No content"}
                    </div>

                    {/* Hiển thị hình ảnh */}
                    {post.images && post.images.length > 0 && (
                      <div className="post-images">
                        {post.images.map((image, index) => (
                          <img key={index} src={image.postImage} alt="Post" />
                        ))}
                      </div>
                    )}

                    <div className="row d-flex justify-content-start align-items-center">
                      <div className="col-2 mt-2 text-center">
                        <div className="like-count">
                          {post.likeCount || 0}
                          <i
                            className={`fa-solid fa-heart ${
                              likedPosts[post.id]?.data
                                ? "text-danger"
                                : "text-muted"
                            }`}
                            onClick={() => handleLikePost(post.id)}
                            style={{ cursor: "pointer", fontSize: "25px" }}
                          ></i>
                        </div>
                      </div>

                      <div className="col-2 mt-2 text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          {post.commentCount || 0}
                          <i
                            type="button"
                            style={{ fontSize: "25px" }}
                            className="fa-regular fa-comment"
                            data-bs-toggle="modal"
                            data-bs-target="#modalComment"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
        {/* phải */}
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <li className=" mb-4">
              <UsersToFollow userId={currentUserId} token={tokenjwt} />
            </li>
          </ul>
        </div>

        {/* Modal để chọn playlist */}
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          tabIndex="-1"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn Playlist</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {playlists.map(
                    (playlist) =>
                      !playlist.status && (
                        <div
                          key={playlist.id}
                          className="post-header-track m-5"
                        >
                          <img
                            src={playlist.imagePlaylist}
                            className="avatar_small"
                            alt="playlist"
                          />
                          <div className="info">
                            <div className="name">{playlist.title}</div>
                          </div>
                          <div className="btn-group" style={{ marginLeft: 25 }}>
                            <button
                              type="button"
                              className="btn-new rounded-5"
                              onClick={() =>
                                handleAddTrackToPlaylist(playlist.id)
                              }
                            >
                              add
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Modal để chọn playlist */}
      </div>
    </div>
  );
};

export default LikePost;
