import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate, Link } from "react-router-dom";
import Waveform from "../Profile_nav/Waveform";
import {
  addLike,
  removeLikePost,
  checkUserLikeTrack,
  removeLike,
  getAllLikedByUser,
} from "../../../../service/likeTrackServiceCus";
import { getTrackById } from "../../../../service/TrackServiceCus";
import UsersToFollow from "../UsersToFollow";
import "./css/likePostStyle.css";

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

  const tokenjwt = localStorage.getItem('jwtToken');


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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading liked items</div>;

  return (
    <div className="likePost mt-5">
      <h1 className="search-results-title text-center mb-5">Liked Post</h1>
      <div className="row side-content">
        {/* side left */}
        <div className="col-3 post-left">
          <h1 className="search-results-title text-center">Orther</h1>
          <ul>
            <li className="side-item">
              <div className="container-fluid nav">
                <Link to={''} >
                  Top
                </Link>
              </div>
            </li>
            <li className="side-item">
              <div className="container-fluid nav">
                <Link to={''}>
                  Following
                </Link>
              </div>
            </li>
            <li className="side-item">
              <div className="container-fluid nav">
                <Link to={''}>
                  Tracks
                </Link>
              </div>
            </li>
            <li className="side-item">
              <div className="container-fluid nav">
                <Link to={''}>
                  Albums
                </Link>
              </div>
            </li>
            <li className="side-item">
              <div className="container-fluid nav ">
                <Link to={''}>
                  PlayList
                </Link>
              </div>
            </li>
          </ul>
        </div>

        {/* main content */}
        <div className="post-list col-6">
          {/* track */}
          <div className="container mt-2">
            {tracks.map((track) => (
              <div className="post border" key={track.id}>
                <div className="post-header position-relative">
                  <button type="button" className="btn" aria-label="Avatar">
                    <img
                      src={track.userId?.avatar || "/default-avatar.png"}
                      className="avatar_small"
                      alt="Avatar"
                    />
                  </button>
                  <div>
                    <div className="name">
                      {track.userName || "Unknown Track"}
                    </div>
                    <div className="time">
                      {new Date(track.createDate).toLocaleString()}
                    </div>
                  </div>

                  {/* Dropdown options nếu cần */}
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
                        <button className="dropdown-item">
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item">
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="post-content description">
                  {track.description || "No description"}
                </div>

                <div className="post-content audio">
                  <Waveform
                    audioUrl={track.trackFile}
                    track={track}
                    className="track-waveform"
                  />
                </div>

                <div className="row d-flex justify-content-start align-items-center">
                  <div className="col-2 mt-2 text-center">
                    <div className="like-count">
                      {track.likeCount || 0}
                      <i
                        className={`fa-solid fa-heart ${likedTracks[track.id]?.data
                            ? "text-danger"
                            : "text-muted"
                          }`}
                        onClick={() => handleLikeTrack(track.id)}
                        style={{ cursor: "pointer", fontSize: "25px" }}
                      ></i>
                    </div>
                  </div>

                  <div className="col-2 mt-2 text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      {track.commentCount || 0}
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
            ))}
          </div>
          {/* post */}
          <div className="container mb-5">
            {posts.map((post) => (
              <div className="post border" key={post.id}>
                <div className="post-header position-relative">
                  <button type="button" className="btn" aria-label="Avatar">
                    <img
                      src={post.userId?.avatar || "/default-avatar.png"}
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

                  {/* Dropdown options nếu cần */}
                  <div className="dropdown position-absolute top-0 end-0">
                    <button
                      className="btn btn-options dropdown-toggle"
                      type="button"
                      id={`dropdownMenuButton-${post.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby={`dropdownMenuButton-${post.id}`}
                    >
                      <li>
                        <button className="dropdown-item">
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item">
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
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
                        className={`fa-solid fa-heart ${likedPosts[post.id]?.data
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
            ))}
          </div>
        </div>

        {/* side right */}
        <div className="col-3 post-right">
          <ul className="list-unstyled">
            <li className=" mb-4">
              <UsersToFollow userId={currentUserId} token={tokenjwt} />
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default LikePost;