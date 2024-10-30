import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import { getAllPlaylistByUserId } from "../../../../service/likeTrackServiceCus";
import { getPlaylistById } from "../../../../service/PlaylistServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { Link } from "react-router-dom";

const LikePlaylists = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchPlayList();
  }, [userId]);

  // fetch list album
  const fetchPlayList = async () => {
    setIsLoading(true);
    try {
      const likedPlayList = await getAllPlaylistByUserId(userId);
      // console.log("list like playlist: ", likedPlayList);

      const fetchedPlayList = [];

      await Promise.all(
        likedPlayList.map(async (item) => {
          try {
            if (item.playlistId) {
              const response = await getPlaylistById(item.playlistId);
              // Kiểm tra xem trackResponse có data không
              if (response && response.data) {
                fetchedPlayList.push(response.data);
                // await checkTrackLikeStatus(trackResponse.data.id); //kta
              }
            }
          } catch (itemError) {
            console.error(`Error fetching item ${item.id}:`, itemError);
          }
        })
      );

      setPlaylist(fetchedPlayList);
      console.log("Fetched Posts:", fetchedPlayList);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("list like album []: ", playlist);
  }, [playlist]); // Chỉ log khi playlist thay đổi

  return (
    <div className=" container albums mt-5">
      <h1 className="search-results-title text-center mb-5">Liked PlayList</h1>

      <div className="row">
        <div className="col-3">
          <h1 className="search-results-title">Orther</h1>
          <nav className="navbar custom-navbar">
            <div className="container-fluid nav">
              <a className="navbar-brand" href="#">
                Top
              </a>
            </div>
          </nav>
          <nav className="navbar custom-navbar">
            <div className="container-fluid nav">
              <a className="navbar-brand" href="#">
                User
              </a>
            </div>
          </nav>
          <nav className="navbar custom-navbar">
            <div className="container-fluid nav">
              <a className="navbar-brand" href="#">
                Tracks
              </a>
            </div>
          </nav>
          <nav className="navbar custom-navbar">
            <div className="container-fluid nav">
              <a className="navbar-brand" href="#">
                Albums
              </a>
            </div>
          </nav>
          <nav className="navbar custom-navbar">
            <div className="container-fluid nav ">
              <a className="navbar-brand" href="#">
                PlayList
              </a>
            </div>
          </nav>
        </div>
        <div className="albums-list col-6 pe-5">
          {/* Albums List */}
          <div className="post-header-albums">
            {isLoading ? (
              <div>Loading albums...</div>
            ) : playlist && playlist.length > 0 ? (
              playlist.map(
                (list) =>
                  !list.status && (
                    <div key={list.id} className="album-item">
                      <img
                        src={
                          list.imagePlaylist || "/src/UserImages/Avatar/avt.jpg"
                        }
                        className="avatar_small"
                        alt="Album Cover"
                      />
                      <div className="info">
                        {/* link album detail */}
                        <Link
                          to={{
                            pathname: `/album/${list.id}`,
                            state: { list },
                          }}
                        >
                          <div className="title">{list.title}</div>
                        </Link>

                        <div className="style">{list.description}</div>

                        <div className="album-details">
                          <span className="tracks">Tracks: 0</span>
                          <span className="likes">Likes: 0</span>
                        </div>
                      </div>

                      <div className="btn-group" style={{ marginLeft: 25 }}>
                        <button
                          className="btn dropdown-toggle no-border"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <ul className="dropdown-menu dropdown-menu-lg-end">
                          <li>
                            <Link to={`/albums/album-Edit/${list.id}`}>
                              <a className="dropdown-item">Edit</a>
                            </Link>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={() => handleDeleteAlbum(list.id)}
                            >
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )
              )
            ) : (
              <div className="no-albums">No albums found</div>
            )}
          </div>
        </div>
        <div className="col-3 ps-5">
          <h1 className="search-results-title">People to Follow </h1>
          <div className="people-to-follow">
            <div>
              <div className="post-header-track">
                <img
                  src="/src/UserImages/Avatar/avt.jpg"
                  className="avatar_small"
                  alt="Avatar"
                />

                <div className="info">
                  <div className="author">userName</div>
                </div>

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
          <div className="people-to-follow">
            <div>
              <div className="post-header-track">
                <img
                  src="/src/UserImages/Avatar/avt.jpg"
                  className="avatar_small"
                  alt="Avatar"
                />

                <div className="info">
                  <div className="author">userName</div>
                </div>

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
          <div className="people-to-follow">
            <div>
              <div className="post-header-track">
                <img
                  src="/src/UserImages/Avatar/avt.jpg"
                  className="avatar_small"
                  alt="Avatar"
                />

                <div className="info">
                  <div className="author">userName</div>
                </div>

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
        </div>
      </div>
    </div>
  );
};

export default LikePlaylists;
