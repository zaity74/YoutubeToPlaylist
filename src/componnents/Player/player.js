import React, { useEffect, useRef, useState } from "react";
import "../Player/player.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { CgPlayTrackPrev, CgPlayTrackNext } from "react-icons/cg";
import { FaPlay } from "react-icons/fa6";
import { MdOutlinePause } from "react-icons/md";
import { TfiLoop } from "react-icons/tfi";

const AudioPlayer = ({
  songPlayer,
  currentSongIndex,
  setCurrentSongIndex,
  isPlaying,
  setIsPlaying,
  audioRef,
  handlePlayPause,
  currentAlbum,
  playlistSongs,
  setCurrentAlbum,
}) => {
  // STATE
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [playerTop, setPlayerTop] = useState(0);

  const playerRef = useRef(null);

  //   DOM PARSER
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    // Set the initial position of the player
    if (playerRef.current) {
      setPlayerTop(playerRef.current.offsetTop);
    }

    const handleScroll = () => {
      if (window.scrollY >= playerTop) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [playerTop]);

  useEffect(() => {
    if (currentSongIndex !== null) {
      const audioElement =
        audioRef.current[currentSongIndex]?.current?.audioEl?.current;

      if (audioElement) {
        const handleLoadedMetadata = () => {
          setDuration(audioElement.duration);
        };

        const handleTimeUpdate = () => {
          setCurrentTime(audioElement.currentTime);
        };

        const handleEnded = () => {
          if (isLooping) {
            audioElement.currentTime = 0;
            audioElement.play();
          } else {
            handleNext();
            setIsPlaying((prevIsPlaying) => {
              const updatedIsPlaying = [...prevIsPlaying];
              updatedIsPlaying[currentSongIndex] = false;
              return updatedIsPlaying;
            });
          }
        };

        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.addEventListener("timeupdate", handleTimeUpdate);
        audioElement.addEventListener("ended", handleEnded);

        // Assurez-vous que la durée est définie si les métadonnées sont déjà chargées
        if (audioElement.readyState >= 1) {
          setDuration(audioElement.duration);
        }

        return () => {
          audioElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioElement.removeEventListener("timeupdate", handleTimeUpdate);
          audioElement.removeEventListener("ended", handleEnded);
        };
      }
    }
  }, [audioRef, currentSongIndex, setIsPlaying]);

  const handleNext = () => {
    let nextIndex;
    let nextAudioElement;

    if (currentAlbum !== null && playlistSongs.length > 0) {
      // Lecture de l'album
      const findIndex =
      playlistSongs && playlistSongs.findIndex((index) => index.name === songPlayer[currentSongIndex].name);
      console.log('son suivant ', findIndex);
      const nextIndexAlbum = (findIndex + 1) % playlistSongs.length;

      nextIndex = songPlayer.findIndex(
        (song) => song._id === playlistSongs[nextIndexAlbum]._id
      );
      setCurrentSongIndex(nextIndex);
      setCurrentAlbum(nextIndexAlbum);

      nextAudioElement = audioRef.current[nextIndex]?.current?.audioEl?.current;
    } else {
      // Lecture de la liste de chansons
      nextIndex = (currentSongIndex + 1) % songPlayer.length;
      setCurrentSongIndex(nextIndex);

      nextAudioElement = audioRef.current[nextIndex]?.current?.audioEl?.current;
    }

    // Pause and reset current song
    if (currentSongIndex !== null) {
      const prevAudioElement =
        audioRef.current[currentSongIndex]?.current?.audioEl?.current;
      if (prevAudioElement) {
        prevAudioElement.pause();
        prevAudioElement.currentTime = 0;
      }
    }

    setIsPlaying((prevIsPlaying) => {
      const updatedIsPlaying = [...prevIsPlaying];
      updatedIsPlaying[currentSongIndex] = false;
      updatedIsPlaying[nextIndex] = true;
      return updatedIsPlaying;
    });

    if (nextAudioElement) {
      nextAudioElement.play();
    }
  };

  const handlePrevious = () => {
    let prevIndex;
    let prevAudioElement;

    if (currentAlbum !== null && playlistSongs.length > 0) {
      // Lecture de l'album
      const prevIndexAlbum =
        (currentAlbum - 1 + playlistSongs.length) % playlistSongs.length;

      prevIndex = songPlayer.findIndex(
        (song) => song._id === playlistSongs[prevIndexAlbum]._id
      );
      setCurrentSongIndex(prevIndex);
      setCurrentAlbum(prevIndexAlbum);

      prevAudioElement = audioRef.current[prevIndex]?.current?.audioEl?.current;
    } else {
      // Lecture de la liste de chansons
      prevIndex =
        (currentSongIndex - 1 + songPlayer.length) % songPlayer.length;
      setCurrentSongIndex(prevIndex);

      prevAudioElement = audioRef.current[prevIndex]?.current?.audioEl?.current;
    }

    // Pause and reset current song
    if (currentSongIndex !== null) {
      const currentAudioElement =
        audioRef.current[currentSongIndex]?.current?.audioEl?.current;
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement.currentTime = 0;
      }
    }

    setIsPlaying((prevIsPlaying) => {
      const updatedIsPlaying = [...prevIsPlaying];
      updatedIsPlaying[currentSongIndex] = false;
      updatedIsPlaying[prevIndex] = true;
      return updatedIsPlaying;
    });

    if (prevAudioElement) {
      prevAudioElement.play();
    }
  };

  const handleSeek = (e) => {
    console.log(e.target.value);
    const seekTime = (e.target.value / 100) * duration;
    console.log("show me audio El", seekTime, duration);
    const audioElement =
      audioRef.current[currentSongIndex].current.audioEl.current;
    if (audioElement) {
      audioElement.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    console.log("loop", isLooping);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (currentSongIndex === null || !songPlayer || songPlayer.length === 0) {
    return (
      <div
        className="player"
        ref={playerRef}
        style={{
          position: isFixed ? "fixed" : "relative",
          backgroundColor: isFixed ? "black " : "rgba(26, 26, 26, 0.4)",
          backdropFilter: isFixed ? "none" : "blur(6px)",
        }}
      >
        <div className="current-song">
          <div className="songInfo">
            {/* <h4>
              {stripHtmlTags(currentSong.name).slice(0, 35)}
              {stripHtmlTags(currentSong.name).length > 15 ? "..." : ""}
            </h4> */}
            <p></p>
          </div>
        </div>

        <div className="playContainer">
          <div className="controls">
            <button className="btn btn-secondary">
              <CgPlayTrackPrev />
            </button>
            <button className="btn btn-primary">
              {isPlaying ? <MdOutlinePause /> : <FaPlay />}
            </button>
            <button className="btn btn-secondary">
              <CgPlayTrackNext />
            </button>
            <button
              className={`btn btn-secondary hello ${
                isLooping ? "active-btn" : ""
              }`}
              onClick={handleLoop}
            >
              <TfiLoop />
            </button>
          </div>
          <div className="progress-container">
            <span>00:00</span>
            <input
              type="range"
              min="0"
              max="100"
              value=''
            />
            <div className="time">
              <span>00:00</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSong = songPlayer[currentSongIndex];

  return (
    <div
      className="player"
      ref={playerRef}
      style={{
        position: isFixed ? "fixed" : "relative",
        backgroundColor: isFixed ? "black " : "rgba(26, 26, 26, 0.4)",
        backdropFilter: isFixed ? "none" : "blur(6px)",
      }}
    >
      
      <div className="current-song">
        <img src={currentSong.thumbnail} alt="song image" />
        <div className="songInfo">
          <h4>
            {stripHtmlTags(currentSong.name).slice(0, 35)}
            {stripHtmlTags(currentSong.name).length > 15 ? "..." : ""}
          </h4>
          <p>{currentSong.artiste}</p>
        </div>
      </div>

      <div className="playContainer">
        <div className="controls">
          <button className="btn btn-secondary" onClick={handlePrevious}>
            <CgPlayTrackPrev />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handlePlayPause(currentSongIndex)}
          >
            {isPlaying ? <MdOutlinePause /> : <FaPlay />}
          </button>
          <button className="btn btn-secondary" onClick={handleNext}>
            <CgPlayTrackNext />
          </button>
          <button
            className={`btn btn-secondary hello ${
              isLooping ? "active-btn" : ""
            }`}
            onClick={handleLoop}
          >
            <TfiLoop />
          </button>
        </div>
        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100}
            onChange={handleSeek}
          />
          <div className="time">
            <span>{currentSong.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
