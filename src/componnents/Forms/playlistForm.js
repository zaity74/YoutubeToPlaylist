import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import './playlistForm.scss';
import { LuPlus } from "react-icons/lu";

// ACTIONS
import { createPlaylist, fetchAllPlaylist } from "../../Redux/Actions/playlistActions";

const CreatePlaylistForm = () => {
  // STATE
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [toogleForm, setToogleForm] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, playlist } = useSelector(
    (state) => state.createPlaylist
  );

  //   FUNCTION
  const handleSubmit = async(e) => {
    e.preventDefault();
    await dispatch(createPlaylist({ name, description, cover }));
    await dispatch(fetchAllPlaylist());
  };

  return (
    <div className="containerForms">
      <div className="titlePlCont">
        <h2 className="titlePlaylist" onClick={() => setToogleForm((prevToogleForm) => !prevToogleForm)}>Create a New Playlist</h2>
        <div className="add" onClick={() => setToogleForm((prevToogleForm) => !prevToogleForm)}>
          Create playlist
          <LuPlus className="icon" />
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} style={{display: toogleForm ? 'block' : 'none'}}>
        <div className="form-group">
          <label htmlFor="name">Playlist Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="cover">Cover URL</label>
          <input
            type="text"
            className="form-control"
            id="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            required
          />
        </div>
        <button type="submit"  disabled={loading}>
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylistForm;
