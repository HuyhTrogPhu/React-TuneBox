import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./css/waveFormFeed.css";
import { images } from "../../../../assets/images/images";
import { Link } from "react-router-dom";

const WaveFormFeed = ({ audioUrl, track }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Tạo gradient cho sóng âm và phần đã phát
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, "#656666");
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666");
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff");
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff");
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1");
    gradient.addColorStop(1, "#B1B1B1");

    const progressGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height * 1.35
    );
    progressGradient.addColorStop(0, "#E94F37");
    progressGradient.addColorStop(
      (canvas.height * 0.7) / canvas.height,
      "#E94F37"
    );
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 1) / canvas.height,
      "#E94F37"
    );
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 2) / canvas.height,
      "#E94F37"
    );
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 3) / canvas.height,
      "#E94F37"
    );
    progressGradient.addColorStop(1, "#E94F37");

    // Khởi tạo WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 5,
    });

    wavesurferRef.current.load(audioUrl);

    wavesurferRef.current.on("ready", () => {
      setDuration(wavesurferRef.current.getDuration());
    });

    wavesurferRef.current.on("audioprocess", () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    return () => wavesurferRef.current.destroy();
  }, [audioUrl]);

  const togglePlayPause = () => {
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  const skipForward = (seconds) => {
    wavesurferRef.current.seekTo(
      (wavesurferRef.current.getCurrentTime() + seconds) / duration
    );
  };

  const skipBackward = (seconds) => {
    wavesurferRef.current.seekTo(
      (wavesurferRef.current.getCurrentTime() - seconds) / duration
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="playerFeed w-100">
      <div className="thumbFeed">
        <i
          className={isPlaying ? "fi-rr-pause" : "fi-rr-play"}
          id="playPause"
          onClick={togglePlayPause}
        ></i>
        <img src={track.imageTrack || images.avt} alt="Track Thumbnail" />
      </div>
      <div className="infoFeed">
        <div className="detailFeed row d-flex">
          <div className="titleFeed col-7">
            <Link
              to={{
                pathname: `/track/${track.id}`,
                state: { track },
              }}
            >
              {track.name || "Tiêu đề Track"}
            </Link>
            <div className="timeFeed">
              <span id="current">{formatTime(currentTime)}</span> /
              <span id="duration">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        <div className="track-button">
          <button onClick={() => skipBackward(10)}>⏪10s</button>
          <button onClick={() => skipBackward(5)}>⏪5s</button>
          <button onClick={() => skipForward(5)}>5s⏩</button>
          <button onClick={() => skipForward(10)}>10s⏩</button>
        </div>
        <div id="wave" ref={waveformRef} className="waveform-containerFeed">
          <div id="hover" className="waveform-hoverFeed"></div>
        </div>
      </div>
    </div>
  );
};

export default WaveFormFeed;
