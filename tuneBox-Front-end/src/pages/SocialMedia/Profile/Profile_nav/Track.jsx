import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTrack } from "../../../../service/TrackService";

const Track = () => {
  const[tracks, setTracks] = useState([]);

  useEffect(() => {
    listTrack().then((response) => {
     
      setTracks(response.data);
    }).catch(error => {
      console.error(error);
      alert("Error occurred while loading Track data!");
    });
  }, []);

  console.log(tracks);
  
  return (
    <div>
      {tracks.map(track => 
        track.status && (
          <div key={track.id} className="post-header-track">
            <img src={track.trackImage || "/src/UserImages/Avatar/avt.jpg"} className="avatar_small" alt="Avatar" />
            <div className="info">
              <div className="name">{track.name}</div>
              <div className="author">{track.creatorName}</div>
            </div>
            <div className="time">{track.createDate}</div>
            <div style={{ marginLeft: 25 }}>
              <Link to={'/'} style={{ color: 'black' }}>
                  <i className="bi bi-example-icon" /> 
              </Link>
            </div>
          </div>
        )
      )}
    </div>
    );
}
export default Track;
