import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import { getAllAlbumByUserId } from "../../../../service/likeTrackServiceCus";
import { getAlbumById } from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { Link } from "react-router-dom";

const LikeAlbum = () => {
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
      const likedAlbums = await getAllAlbumByUserId(userId);
      console.log("list like album: ", likedAlbums);

      const fetchedAlbum = [];

      await Promise.all(
        likedAlbums.map(async (item) => {
          try {
            if (item.albumId) {
              const response = await getAlbumById(item.albumId);
              // Kiểm tra xem trackResponse có data không
              if (response && response.data) {
                fetchedAlbum.push(response.data);
                // await checkTrackLikeStatus(trackResponse.data.id); //kta
              }
            }
          } catch (itemError) {
            console.error(`Error fetching item ${item.id}:`, itemError);
          }
        })
      );

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
  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAlbum(albumId);
      alert("Album deleted successfully!");
      fetchListAlbum(); // Cập nhật lại danh sách album sau khi xóa
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums mt-5">
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
                          onClick={() => handleDeleteAlbum(album.id)}
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

export default LikeAlbum;
