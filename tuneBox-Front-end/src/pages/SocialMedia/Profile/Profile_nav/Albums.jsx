import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { Link } from "react-router-dom";

const Albums = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchListAlbum();
  }, [userId]);

  // fetch list album
  const fetchListAlbum = async () => {
    setIsLoading(true);
    try {
      const albumsResponse = await getAlbumsByUserId(userId);

      setAlbums(albumsResponse || []);

      // Đếm số lượng album có status là false
      const inactiveAlbumsCount = albumsResponse.filter(
        (album) => album.status === false
      ).length;
      console.log(
        "Number of inactive albums (status = false):",
        inactiveAlbumsCount
      );
    } catch (error) {
      console.error("Error fetching Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      alert("Album deleted successfully!");
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums">
      <div className="btn-container">
        {/* link album new */}
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
                    src={album.albumImage}
                    className="avatar_small"
                    alt="Avatar"
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
                        <Link to={`/albums/album-Edit/${album.id}`}>
                          <a className="dropdown-item">Edit</a>
                        </Link>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          onClick={() => handDeleteAlbum(album.id)}
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
  );
};

export default Albums;
