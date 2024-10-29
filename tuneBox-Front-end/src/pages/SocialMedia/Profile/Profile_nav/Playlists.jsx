import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlaylistByUserId } from "../../../../service/PlaylistServiceCus";
import Cookies from "js-cookie";

const Playlists = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);

  const [playlists, setPlaylists] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchListPlaylist();
  }, [userId]);

  console.log("playlist:", playlists);

  // fetch list album
  const fetchListPlaylist = async () => {
    setIsLoading(true);
    try {
      const playlistResponse = await getPlaylistByUserId(userId);

      setPlaylists(playlistResponse || []);

      // Đếm số lượng có status là false
      const inactiveAlbumsCount = playlistResponse.filter(
        (playlist) => playlist.status === false
      ).length;
      console.log(
        "Number of inactive playlist (status = false):",
        inactiveAlbumsCount
      );
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums">
      <div className="btn-container">
        {/* link playlist new */}
        <Link>
          <button type="button" className="btn-new">
            New
          </button>
        </Link>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button type="button" className="btn-search">
            Search
          </button>
        </div>
      </div>

      {/* playlist List */}
      <div className="post-header-albums">
        {isLoading ? (
          <div>Loading albums...</div>
        ) : playlists && playlists.length > 0 ? (
          playlists.map(
            (list) =>
              !list.status && (
                <div key={list.id} className="album-item">
                  <img src="" className="avatar_small" alt="Avatar" />
                  <div className="info">
                    {/* link list detail */}
                    <Link>
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
                        <Link>
                          <a className="dropdown-item">Edit</a>
                        </Link>
                      </li>
                      <li>
                        <a className="dropdown-item">Delete</a>
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
  );
};

export default Playlists;
