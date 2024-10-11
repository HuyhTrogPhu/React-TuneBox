import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./css/waveForm.css";
import { images } from "../../../../assets/images/images";

const Waveform = ({ audioUrl, track }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Khởi tạo WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "Gray",
      progressColor: "#4F4F4F",
    });

    // Tải file âm thanh từ Cloudinary
    wavesurferRef.current.load(audioUrl);

    wavesurferRef.current.on("ready", () => {
      setDuration(wavesurferRef.current.getDuration());
    });

    wavesurferRef.current.on("audioprocess", () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    return () => wavesurferRef.current.destroy(); // Dọn dẹp khi component không còn
  }, [audioUrl]);

  const togglePlayPause = () => {
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Định dạng MM:SS
  };

  return (
      <div className="player w-100">
        <div className="thumb">
          <img src={track.imageTrack || images.avt} />
        </div>
        <div className="info">
          <div className="detail">
            <div className="title">
              {track.name || "Tiêu đề Track"}
              <div className="time">
                <span id="current">{formatTime(currentTime)}</span> /
                <span id="duration">{formatTime(duration)}</span>
              </div>
            </div>
            <div className="control" onClick={togglePlayPause}>
              <i
                className={isPlaying ? "fi-rr-pause" : "fi-rr-play"}
                id="playPause"
              ></i>
            </div>
          </div>
          <div id="wave" ref={waveformRef}></div>
        </div>

        
      </div>
  );
};

export default Waveform;
