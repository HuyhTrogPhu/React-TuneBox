import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './css/waveForm.css';
import { images } from '../../../../assets/images/images';

const Waveform = () => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Khởi tạo WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
    });

    // Tải file âm thanh
    wavesurferRef.current.load('/audio/XuiHayVui.mp3');

    wavesurferRef.current.on('ready', () => {
      setDuration(wavesurferRef.current.getDuration());
    });

    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    return () => wavesurferRef.current.destroy(); // Dọn dẹp khi component không còn
  }, []);

  const togglePlayPause = () => {
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  return (
    <section>
      <div className="player">
        <div className="thumb">
          <img src={images.avt} alt="" />
        </div>
        <div className="info">
          <div className="detail">
            <div className="title">
              HiHi
              <div className="time">
                <span id="current">{currentTime.toFixed(2)}</span> /
                <span id="duration">{duration.toFixed(2)}</span>
              </div>
            </div>
            <div className="control" onClick={togglePlayPause}>
              <i className={isPlaying ? 'fi-rr-pause' : 'fi-rr-play'} id="playPause"></i>
            </div>
          </div>
          <div id="wave" ref={waveformRef}></div>
        </div>
      </div>
    </section>
  );
};

export default Waveform;
