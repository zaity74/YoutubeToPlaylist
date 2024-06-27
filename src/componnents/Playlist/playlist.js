import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdOutlinePause } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import "./Playlist.scss";

// REDUX IMPORT
import {
  fetchAllPlaylist,
  deletePlaylist,
} from "../../Redux/Actions/playlistActions";

const PlaylistList = ({
  handlePlaySong,
  isPlaying,
  setPlaylistSong,
  playlists,
  setCreatedPlaylist, 
  createdPlaylist
}) => {
  // STATE

  // USE CONSTANTE & API
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.fetchAllPlaylist);
  const errorAddPlaylist = useSelector((state) => state.addToPlaylist.error);

  // EFFECTS
  useEffect(() => {
    dispatch(fetchAllPlaylist());
  }, [dispatch, isPlaying]);

  useEffect(() => {
    if (playlists) {
      setCreatedPlaylist(playlists);
    }
  }, [playlists]);


  // FUNCTIONS
  const handleDeletePlaylist = async (id) => {
    await dispatch(deletePlaylist(id));
    await dispatch(fetchAllPlaylist())
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>All Playlists</h2>
      <div className="row">
        {createdPlaylist && createdPlaylist.length > 0 ? (
          createdPlaylist.map((pl, index) => (
            <div className="cardCont" key={index}>
              <div className="card ">
                <Link to={`/playlist/${pl._id}`}>
                  <img
                    src={pl.cover}
                    className="card-img-top"
                    alt={`${pl.name} cover`}
                  />
                </Link>

                <div className="card-body">
                  <RxCross2 className="cross" onClick={() => handleDeletePlaylist(pl._id)} />
                  <h5 className="card-title">{pl.name}</h5>
                  <p className="card-text">{pl.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created by: {pl.user.name.firstname}{" "}
                      {pl.user.name.lastname}
                    </small>
                  </p>
                  <p>
                    <small className="text-muted">
                      Il y'a {pl.songs.length} titres
                    </small>
                    <span>{pl.totalDuration}</span>
                  </p>
                </div>
                <button
                  className="play-button"
                  onClick={() => handlePlaySong(pl.songs, index)}
                >
                  {isPlaying[index] ? <MdOutlinePause /> : <FaPlay />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No playlists available.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistList;
