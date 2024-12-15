import React, { useEffect, useState } from "react";
import { images } from "../../../../assets/images/images";
import { deleteAlbum } from "../../../../service/AlbumsServiceCus";
import { getAllAlbumByUserId } from "../../../../service/likeTrackServiceCus";
import { getAlbumById } from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { Link } from "react-router-dom";
import UsersToFollow from "../UsersToFollow";
import { getLikesCountByAlbumsId } from "../../../../service/likeTrackServiceCus";
import { ToastContainer, toast } from "react-toastify";

const LikeAlbum = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tokenjwt = localStorage.getItem("jwtToken");
  const [likesCount, setLikesCount] = useState();

  // Fetch initial data
  useEffect(() => {
    fetchListAlbum();
  }, [userId]);

  // fetch list album
  const fetchListAlbum = async () => {
    setIsLoading(true);
    try {
      const likedAlbums = await getAllAlbumByUserId(userId);
      // console.log("list like album: ", likedAlbums);

      const fetchedAlbum = [];
      const likesCountsMap = {};

      await Promise.all(
        likedAlbums.map(async (item) => {
          try {
            if (item.albumId) {
              const response = await getAlbumById(item.albumId);
              // Kiểm tra xem trackResponse có data không
              if (response && response.data) {
                fetchedAlbum.push(response.data);
              }

              if (item.albumId) {
                const response = await getLikesCountByAlbumsId(item.albumId);
                likesCountsMap[item.albumId] = response.data; // Store the like count for each listalbum
              }
            }
          } catch (itemError) {
            console.error(`Error fetching item ${item.albumId}:`, itemError);
          }
        })
      );

      setLikesCount(likesCountsMap);
      setAlbums(fetchedAlbum);
      console.log("Fetched Posts:", fetchedAlbum);
    } catch (error) {
      console.error("Error fetching Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("list like album []: ", albums);
  }, [albums]); // Chỉ log khi albums thay đổi

  // delete album
  const handDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) {
      return;
    }

    setIsLoading(true);
    try {
      const albumsResponse = await deleteAlbum(albumId);
      console.log("Album deleted successfully:", albumsResponse);
      fetchListAlbum();
      toast.success("Album deleted successfully!");
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums mt-5">
      <ToastContainer />
      <h1 className="search-results-title text-center mb-5">Liked Albums</h1>

      <div className="row container-fluid">
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <h1 className="search-results-title">Orther</h1>
            <li className="left mb-4">
              <Link to={"/likepost"} className="d-flex align-items-center">
                <img
                  src={images.feedback}
                  alt="icon"
                  width={20}
                  className="me-2"
                />
                <span className="fw-bold">Bài viết đã thích</span>
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
        <div className="albums-list col-6 content p-4">
          {/* Albums List */}
          <div className="post-header-albums">
            {isLoading ? (
              <div>Loading albums...</div>
            ) : albums && albums.length > 0 ? (
              albums.map(
                (album) =>
                  !album.status && (
                    <div key={album.id} className="album-item">
                      <img
                        src={album.albumImage}
                        className="avatar_small"
                        alt="Album Cover"
                      />
                      <div className="info">
                        {/* link album detail */}
                        <Link
                          to={{
                            pathname: `/album/${album.id}`,
                            state: { album },
                          }}
                        >
                          <div className="title">{album.title}</div>
                        </Link>

                        <div className="style">{album.description}</div>

                        <div className="album-details">
                          <span className="tracks">
                            Tracks: {album.tracks.length}
                          </span>
                          <span className="likes">
                            {" "}
                            Likes:{" "}
                            {likesCount && likesCount[album.id]
                              ? likesCount[album.id]
                              : 0}
                          </span>
                        </div>
                      </div>

                      {String(album.creatorId) === String(userId) ? (
                        <div className="dropdown top-8 end-0 me-4 ">
                          <button
                            className="btn dropdown-toggle no-border"
                            type="button"
                            id={`dropdownMenuButton-${album.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          />
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${album.id}`}
                          >
                            <li>
                              <Link to={`/albums/album-Edit/${album.id}`}>
                                <button className="dropdown-item">Edit</button>
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handDeleteAlbum(album.id)}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button
                          className="fa-regular fa-flag btn-report top-8 end-0 me-4 border-0"
                          onClick={() => handleReport(album.id, "album")}
                        ></button>
                      )}
                    </div>
                  )
              )
            ) : (
              <div className="no-albums">No albums found</div>
            )}
          </div>
        </div>
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <li className=" mb-4">
              <UsersToFollow userId={userId} token={tokenjwt} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LikeAlbum;