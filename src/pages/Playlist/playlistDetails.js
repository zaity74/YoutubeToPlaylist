import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../componnents/Navbar/navbar";
import AudioPlayer from "../../componnents/Player/player";
import { fetchPlaylistDetail } from "../../Redux/Actions/playlistActions";
import "./playlistDetail.scss"; // Assuming you have a shared stylesheet
import { Link } from "react-router-dom";
import { MdOutlinePause } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import ReactAudioPlayer from "react-audio-player";

const PlaylistDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const playlistDetail = useSelector((state) => state.fetchPlaylistDetail);
  const { playlist, loading, error } = playlistDetail;
  const detailPlaylist = playlist && playlist.detailPlaylist || {};
  console.log('details',detailPlaylist);

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState([]);
  const audioRefs = useRef([]);

  useEffect(() => {
    dispatch(fetchPlaylistDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (detailPlaylist.songs) {
      setIsPlaying(Array(detailPlaylist.songs.length).fill(false));
      audioRefs.current = detailPlaylist.songs.map(() => React.createRef());
    }
  }, [detailPlaylist.songs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const handlePlayPause = (index) => {
    const updatedIsPlaying = [...isPlaying];

    if (currentSongIndex !== null && currentSongIndex !== index) {
      audioRefs.current[currentSongIndex].current.audioEl.current.pause();
      audioRefs.current[currentSongIndex].current.audioEl.current.currentTime = 0;
      updatedIsPlaying[currentSongIndex] = false;
    }

    if (audioRefs.current[index].current.audioEl.current.paused) {
      audioRefs.current[index].current.audioEl.current.play();
      updatedIsPlaying[index] = true;
    } else {
      audioRefs.current[index].current.audioEl.current.pause();
      updatedIsPlaying[index] = false;
    }

    setIsPlaying(updatedIsPlaying);
    setCurrentSongIndex(index);
  };

  return (
    <>
      <Navbar />
      <div className="section-container">
        <div className="custom-container">
          <div className="formContainer col-10">
            {/* TITLE CONTAINER */}
            <div className="titleContainer">
              <h2>{detailPlaylist.name}</h2>
            </div>

            <div className="info">
              <img
                src={detailPlaylist.cover}
                alt={`${detailPlaylist.name} cover`}
                className="playlist-cover"
              />
              <p>{detailPlaylist.description}</p>
              <p>
                Created by: {detailPlaylist.user?.name?.firstname}{" "}
                {detailPlaylist.user?.name?.lastname}
              </p>
              <p>Total duration: {detailPlaylist.totalDuration}</p>
            </div>
            {/* AUDIO PLAYER */}
            <AudioPlayer
              songPlayer={detailPlaylist.songs || []}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              audioRef={audioRefs}
              handlePlayPause={handlePlayPause}
              currentAlbum={null}
              playlistSongs={detailPlaylist.songs || []}
              setCurrentAlbum={() => {}}
            />

            {/* LIST SONG */}
            <div className="table-responsive">
              <ul className="song-list">
                {detailPlaylist.songs?.map((song, index) => (
                  <li key={index} className="song-item">
                    <div className="song-details">
                      <img
                        src={song.thumbnail}
                        alt="music cover"
                        className="song-thumbnail"
                      />
                      <div className="song-info">
                        <Link to={song.url}>{song.name}</Link>
                        <p>{song.artiste}</p>
                        <p>{song.genre}</p>
                        <p>{song.duration}</p>
                      </div>
                    </div>
                    <div className="song-actions">
                      <ReactAudioPlayer
                        ref={audioRefs.current[index]}
                        src={song.file}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => handlePlayPause(index)}
                      >
                        {isPlaying[index] ? <MdOutlinePause /> : <FaPlay />}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistDetail;
