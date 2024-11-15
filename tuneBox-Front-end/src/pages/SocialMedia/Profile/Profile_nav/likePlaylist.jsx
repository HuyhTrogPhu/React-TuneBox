import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import { getAllPlaylistByUserId } from "../../../../service/likeTrackServiceCus";
import { getPlaylistById } from "../../../../service/PlaylistServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import "./css/likePlaylist.css";
import { Link } from "react-router-dom";
import UsersToFollow from "../UsersToFollow";


const LikePlaylists = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tokenjwt = localStorage.getItem('jwtToken');


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
    <div className="playlist mt-5">
      <h1 className="search-results-title text-center mb-5">Liked PlayList</h1>
      <div className="row side-content">
        {/* playlist left */}
        <div className="col-3 playlist-left">
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
        <div className="playlist-content col-6">
          {/* Play List */}
          <div className="post-header-albums">
            {isLoading ? (
              <div>Loading playlist...</div>
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
                            pathname: `/playlist/${list.id}`,
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
              <div className="no-albums">No playlist found</div>
            )}
          </div>
        </div>
        {/* playlist right */}
        <div className="col-3  playlist-right">
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

export default LikePlaylists;
