import "../Profile/Profile_nav/css/searchForm.css";
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const SearchForm = () => {
  const location = useLocation();
  const { results } = location.state;

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="row">
        <div className="col-3">
         
        </div>
        <div className="col-6 pe-5">
          <div className="search-results">
            <div className="search-item Search-User">
              <h2 className="search-title">Users</h2>
              {results.users && results.users.length > 0 ? (
                <div>
                  {results.users.map((user) => (
                    <div key={user.id} className="post-header-track">
                      <img
                        src={user.avatar || "/src/UserImages/Avatar/avt.jpg"}
                        className="avatar_small"
                        alt="Avatar"
                      />

                      <div className="info">
                        <Link to={`/profile/${user.id}/activity`}>
                          <div className="author">
                            {user.name || "Unknown userName"}
                          </div>
                        </Link>
                        <div className="author">
                          @{user.userName || "Unknown userName"}
                        </div>
                      </div>


                    </div>
                  ))}{" "}
                </div>
              ) : (
                <p>Không có kết quả tìm kiếm</p>
              )}
            </div>
            <div className="search-item Search-Track">
              <h2 className="search-title">Tracks</h2>
              {results.tracks && results.tracks.length > 0 ? (
                <div>
                  {results.tracks.map((track) => (
                    <div key={track.trackId} className="post-header-track">
                      <img
                        src={
                          track.imageTrack || "/src/UserImages/Avatar/avt.jpg"
                        }
                        className="avatar_small"
                        alt="Avatar"
                      />

                      <div className="info">
                        <Link to={`/track/${track.trackId}`}>
                          <div className="name">
                            {track.trackName || "Unknown Track"}
                          </div>
                        </Link>

                        <div className="author">
                          {track.userNameTrack || "Unknown userName"}
                        </div>
                      </div>

                      
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có kết quả tìm kiếm</p>
              )}
            </div>
            <div className="search-item Search-Album">
              <h2 className="search-title">Albums</h2>
              {results.albums && results.albums.length > 0 ? (
                <div>
                  {results.albums.map((album) => (
                    <div key={album.albumId} className="post-header-track">
                      <img
                        src={
                          album.imageAlbum || "/src/UserImages/Avatar/avt.jpg"
                        }
                        className="avatar_small"
                        alt="Avatar"
                      />

                      <div className="info">
                        <Link to={`/album/${album.albumId}`}>
                        <div className="name">
                          {album.albumTitle || "Unknown Track"}
                        </div>
                        </Link>
                       

                        <div className="author">
                          {album.userNameAlbum || "Unknown userName"}
                        </div>
                      </div>

                      
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có kết quả tìm kiếm</p>
              )}
            </div>
            <div className="search-item Search-PlayList">
              <h2 className="search-title">PlayList</h2>
              {results.playlists && results.playlists.length > 0 ? (
                <div>
                  {results.playlists.map((playlist) => (
                    <div
                      key={playlist.playListId}
                      className="post-header-track"
                    >
                      <img
                        src={
                          playlist.imagePlaylist ||
                          "/src/UserImages/Avatar/avt.jpg"
                        }
                        className="avatar_small"
                        alt="Avatar"
                      />

                      <div className="info">
                        <Link to={`/playlist/${playlist.playListId}`}>
                        <div className="name">
                          {playlist.playListTitle || "Unknown Track"}
                        </div>
                        </Link>
                       

                        <div className="author">
                          {playlist.userNamePlaylist || "Unknown userName"}
                        </div>
                      </div>

                      
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có kết quả tìm kiếm</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-3 ps-5">
          
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
