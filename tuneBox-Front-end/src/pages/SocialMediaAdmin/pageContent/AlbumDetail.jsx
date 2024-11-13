import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { LoadAlbumsById } from "../../../service/SocialMediaAdminService";
const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState({});
  const [track, setTrack] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API của Album
      const responsePlayList = await LoadAlbumsById(id);
      if (responsePlayList.status) {
        setAlbum(responsePlayList.dataAlbums);
        setTrack(responsePlayList.dataTracks);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
console.log("album:",album)
  }, [album]);
  if (loading) {
    return <div>Loading...</div>; 
      }
  return (
    <div>
      <div className="container-fluid my-4">
        {/* Total content */}
        <div className="row text-center mb-4">
          {/* Total track */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                {console.log("album on jsx",album)}
                <h5 className="card-title">Total Tracks</h5>
                <p className="card-text display-4">
                  {album.tracks ? album.tracks.length : "0"}
                </p>
              </div>
            </div>
          </div>
          {/* Total comments */}

        </div>
        {/* Album */}
        <div className="row align-items-center mb-4">
          <div className="col-lg-4 col-md-6 mb-4">
            <img
              src={album.image}
              alt="Album Image"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-lg-8 col-md-6 mb-4">
            <h4 className="mb-2">{album.title}</h4>
            <p className="d-inline-block mb-1">
              <strong>{album.creator ? album.creator.userName: "unkown"}</strong>
            </p>
            <p>Released: {album.createDate}</p>
            <p>Genre: {album.genreName? album.genreName:"unkown"}</p>
            <p>Creator: {album.creator? album.creator:"unkown"}</p>
            <p>Description: {album.description? album.description:"unkown"}</p>
          </div>
        </div>
        {/* Tracks of album */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">Tracks</h5>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Track Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {track.map((track, index) => (
                  <tr key={track.id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={track.imageTrack || images.ava} // Kiểm tra nếu có trackImage, nếu không thì dùng hình ảnh mặc định
                          alt="Track Image"
                          className="rounded me-3"
                          style={{ width: 50 }}
                        />
                        <div>
                          <h6 className="mb-0">{track.name}</h6>
                          <small>{track.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                    <button
                          className="btn btn-warning"
                          onClick={() =>
                            navigate(`/socialadmin/TrackDetail/${track.id}`)
                          }
                        >
                          Views
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlbumDetail;
