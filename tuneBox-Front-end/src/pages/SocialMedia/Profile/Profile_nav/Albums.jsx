import React, { useEffect, useState } from "react";
import { getAlbumsByUserId } from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { Link } from "react-router-dom";

const Albums = () => {
  const userId = Cookies.get("UserID");
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchListAlbum = async () => {
      setIsLoading(true);
      try {
        const albumsResponse = await getAlbumsByUserId(userId);

        setAlbums(albumsResponse || []);
      } catch (error) {
        console.error("Error fetching Albums:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListAlbum();
  }, [userId]);

  return (
    <div className="albums">
      <div className="btn-container">
        <Link
          to={{
            pathname: `/albums/create-newAlbum`,
            // state: { userId: userId },
          }}
        >
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
                    src="/src/UserImages/Avatar/avt.jpg"
                    className="avatar_small"
                    alt="Avatar"
                  />
                  <div className="info">
                    <a href="#">
                      <div className="title">{album.title}</div>
                    </a>

                    <div className="style">{album.description}</div>

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
                        <a className="dropdown-item">Edit</a>
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
          <div className="no-albums">No albums found</div>
        )}
      </div>
    </div>
  );
};

export default Albums;
