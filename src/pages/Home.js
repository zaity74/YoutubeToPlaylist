import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { FaPlay } from "react-icons/fa6";
import { MdOutlinePause } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import AudioPlayer from "../componnents/Player/player";
import { LuPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Header from "../componnents/Forms/Header/header";
import { ImYoutube } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { RiFilterFill } from "react-icons/ri";

// HOOKS
import React from "react";
import { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTable } from "react-table";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// COMPOSANT IMPORT
import "../pages/Home.scss";
import Navbar from "../componnents/Navbar/navbar";
import CreatePlaylistForm from "../componnents/Forms/playlistForm";
import PlaylistList from "../componnents/Playlist/playlist";
import {
  fetchAllPlaylist,
  addToPlaylist,
} from "../Redux/Actions/playlistActions";

// REDUX IMPORT
import {
  allSongs,
  createSong,
  removeSong,
  clearAllSong,
} from "../Redux/Actions/songAction";

const Home = () => {
  // STATE

  const [categoryTitle, setCategoryTitle] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [sortGenre, setSortGenre] = useState([]);
  const [searchArtiste, setSearchArtiste] = useState("");
  const [limitPage, setLimitPage] = useState();
  const [sortedField, setSortedField] = useState("title");
  const [sortedOrder, setSortedOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [songPerPage, setSongPerPage] = useState(0);
  const [nextPage, setNextPage] = useState(0);
  const [toogleTri, setToogleTri] = useState(false);
  const [toogleGenre, setToogleGenre] = useState(false);

  const [url, setUrl] = useState("");
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(0);
  const [allGenre, setAllGenre] = useState([]);

  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [createdPlaylist, setCreatedPlaylist] = useState([]);
  const [loadingSongId, setLoadingSongId] = useState(null);

  // DATA RESPONSE AND USE CONSTANTE
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { song } = useSelector((state) => state.fetchAllSong);
  const loadingSong = useSelector((state) => state.fetchAllSong.loading);
  const errorgSong = useSelector((state) => state.fetchAllSong.error);
  const songs = song && song.songs;

  const loadCreateSong = useSelector((state) => state.createSong.loading);
  const errorCreateSong = useSelector((state) => state.createSong.error);

  const { playlists } = useSelector((state) => state.fetchAllPlaylist.playlist);
  const loadingPlaylist = useSelector(
    (state) => state.fetchAllPlaylist.loading
  );

  const loadingAddPlaylist = useSelector(
    (state) => state.addToPlaylist.loading
  );
  const errorAddPlaylist = useSelector((state) => state.addToPlaylist.error);
  const [errorPlaylist, setErrorPlaylist] = useState("");

  // STATE 2
  const [isPlaying, setIsPlaying] = useState([]);
  const [albumPlaying, setAlbumPlaying] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const audioRefs = useRef([]);

  // EFFECTS 1
  useEffect(() => {
    // Get query parameters and affect them to useState constante
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") || 1;

    const title = queryParams.get("title") || "";
    setSearchTitle(title);

    const artiste = queryParams.get("artiste") || "";
    setSearchArtiste(artiste);

    const sortField = queryParams.get("sortField") || "title";
    setSortedField(sortField);

    const genre = queryParams.get("genre") || "";
    setSortGenre(genre);
    if (genre) {
      setSortGenre(genre.split(","));
    } else {
      setSortGenre([]);
    }

    const limit = queryParams.get("limit");
    setLimitPage(limit);

    const sortOrder = queryParams.get("sortOrder") || "asc";
    setSortedOrder(sortOrder);

    // FETCH ALL SONGS
    const fetchAllSongs = async () => {
      try {
        await dispatch(
          allSongs({ page, title, genre, artiste, sortField, sortOrder, limit })
        );
      } catch (error) {
        setMessage("Error fetching all the video");
      }
    };
    fetchAllSongs();
  }, [location.search, dispatch]);

  // Fetch playlists on component mount
  useEffect(() => {
    dispatch(fetchAllPlaylist());
  }, [dispatch]);

  // EFFECTS 3
  useEffect(() => {
    if (songs && song) {
      setPlaylist(songs);
      setTotal(song.total);
      setResult(song.results);
      setAllGenre(song.allGenre);
      setSongPerPage(song.songPerPage);
      const nextPageBis =
        song.pagination && song.pagination.next
          ? song.pagination.next.page
          : songPerPage && songPerPage.length;
      setNextPage(nextPageBis);
    }
  }, [songs, song]);

  // EFFECTS 4
  useEffect(() => {
    if (playlist.length > 0) {
      setIsPlaying(Array(playlist.length).fill(false));
      audioRefs.current = playlist.map(() => React.createRef());
    }
  }, [playlist]);

  // EFFECTS 5
  useEffect(() => {
    // Au chargement de la page le state currentPage prend la valeur du parametre page
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get("page")) || 1;
    setCurrentPage(page);

    // Si page est egale a une page sans produit, revenir a la premiere page
    const nonEmptyPages = songPerPage
      ? songPerPage.filter((pageData) => pageData.count > 0)
      : [];
    if (page > nonEmptyPages.length && nonEmptyPages.length > 0) {
      setCurrentPage(1);
      queryParams.set("page", 1);
      navigate({ search: queryParams.toString() });
    }
  }, [location.search, songPerPage]);

  // EFFECTS 6
  useEffect(() => {
    console.log("Updated albumPlaying:", isPlaying, albumPlaying, currentAlbum);
  }, [isPlaying, albumPlaying, currentAlbum]);

  useEffect(() => {
    if (errorCreateSong) {
      setMessage(errorCreateSong);
    } else {
      setMessage("");
    }
  }, [errorCreateSong, message]);

  // FUNCTIONS CREATE SONGS
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get query parameters and affect them to useState constante
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") || 1;

    try {
      await dispatch(
        createSong({
          url,
          description,
          genre,
        })
      );
      await dispatch(allSongs({ page }));
      // setMessage(response.data.msg); // Adjust to match the API response key
      setUrl("");
      setDescription("");
      setGenre("");
    } catch (error) {
      console.error("handleSubmit error:", error);
    }
  };

  const handleDelete = async (id) => {
    // Get query parameters and affect them to useState constante
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") || 1;
    try {
      await dispatch(removeSong(id));
      await dispatch(allSongs({ page }));
    } catch (error) {
      setMessage("Error deleting the video");
      console.error("handleDelete error:", error);
    }
  };

  const clearAll = async () => {
    // Get query parameters and affect them to useState constante
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") || 1;
    try {
      await dispatch(clearAllSong());
      await dispatch(allSongs({ page }));
    } catch (error) {
      setMessage("Error clearing the playlist");
      console.error("handleDelete error:", error);
    }
  };

  const handleSearchChange = (event) => {
    event.preventDefault();
    const newTitle = searchTitle;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("title", newTitle);
    navigate({ search: queryParams.toString() });
    setSearchArtiste("");
  };

  const handleSearchArtiste = (event) => {
    event.preventDefault();
    const newArtiste = searchArtiste;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("artiste", newArtiste);
    navigate({ search: queryParams.toString() });
  };

  const handleSortChange = (field, order) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sortField", field);
    queryParams.set("sortOrder", order);
    navigate({ search: queryParams.toString() });
  };

  const handleSortByGenres = (event) => {
    const queryParams = new URLSearchParams(location.search);
    const selectedGenres = event.target.value;
    const isChecked = event.target.checked;

    let updatedGenres = [...sortGenre];
    if (isChecked) {
      if (!updatedGenres.includes(selectedGenres)) {
        updatedGenres.push(selectedGenres);
      }
    } else {
      updatedGenres = updatedGenres.filter((cat) => cat !== selectedGenres);
    }

    if (updatedGenres.length > 0) {
      queryParams.set("genre", updatedGenres.join(","));
    } else {
      queryParams.delete("genre");
    }

    navigate({ search: queryParams.toString() });
  };
  const goToPage = (pageIndex) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", pageIndex);
    navigate({ search: queryParams.toString() });
    setCurrentPage(pageIndex);
  };

  // FUNCTIONS HANDLE PLAYER
  const handlePlayPause = (index, albumIndex = currentAlbum) => {
    const updatedIsPlaying = [...isPlaying];
    const updateAlbumPlaying = [...albumPlaying];

    // Pause other song different from currentSong
    if (currentSong !== null && currentSong !== index) {
      audioRefs.current[currentSong].current.audioEl.current.pause();
      audioRefs.current[currentSong].current.audioEl.current.currentTime = 0;
      updatedIsPlaying[currentSong] = false;
      updateAlbumPlaying[currentAlbum] = false;
    }

    if (audioRefs.current[index].current.audioEl.current.paused) {
      audioRefs.current[index].current.audioEl.current.play();
      updatedIsPlaying[index] = true;
      updateAlbumPlaying[albumIndex] = true;
    } else {
      audioRefs.current[index].current.audioEl.current.pause();
      updatedIsPlaying[index] = false;
      updateAlbumPlaying[albumIndex] = false;
    }

    setIsPlaying(updatedIsPlaying);
    setCurrentAlbum((prevCurrentAlbum) => albumIndex);
    setAlbumPlaying(updateAlbumPlaying);
    setCurrentSong(index);
    console.log("show albumm", albumPlaying, albumIndex);
  };

  const handlePause = (index, albumIndex = currentAlbum) => {
    const updatedIsPlaying = [...isPlaying];
    const updateAlbumPlaying = [...albumPlaying];

    if (audioRefs.current[index].current.audioEl.current.played) {
      audioRefs.current[index].current.audioEl.current.pause();
      updatedIsPlaying[index] = false;
      updateAlbumPlaying[albumIndex] = false;
    }

    setIsPlaying(updatedIsPlaying);
    setCurrentAlbum((prevCurrentAlbum) => albumIndex);
    setAlbumPlaying(updateAlbumPlaying);
    setCurrentSong(index);
  };

  // Methode play de l'album : albumPlaying bool play : false,
  const handlePlaySong = (songs, albumIndex) => {
    setAlbumPlaying(Array(songs.length).fill(false));
    if (currentAlbum !== null) {
      handlePause(currentAlbum, albumIndex);
    }
    setPlaylistSongs(songs);
    const findIndex =
      playlist && playlist.findIndex((index) => index.name === songs[0].name);
    handlePlayPause(findIndex, albumIndex); // Start with the first song in the playlist
  };

  const handleAddToPlaylist = async (playlistId, songId) => {
    setLoadingSongId(songId);
    await dispatch(addToPlaylist(songId, { playlistId, songId }));
    await dispatch(fetchAllPlaylist());
    setLoadingSongId(null);

    console.log(playlistId, songId);
  };

  //  Order display
  const orderDisplay = (
    <div className="orderBlock">
      <div className="select">
        <input
          type="radio"
          name="sortOrder"
          id="artiste-asc"
          value="artiste-asc"
          checked={sortedField === "artiste" && sortedOrder === "asc"}
          onChange={() => handleSortChange("artiste", "asc")}
        />
        <label htmlFor="createdAt-asc">Artiste A-Z</label>
      </div>
      <div className="select">
        <input
          type="radio"
          name="sortOrder"
          id="artiste-desc"
          value="artiste-desc"
          checked={sortedField === "artiste" && sortedOrder === "desc"}
          onChange={() => handleSortChange("artiste", "desc")}
        />
        <label htmlFor="createdAt-asc">Artiste Z-A</label>
      </div>
      <div className="select">
        <input
          type="radio"
          name="sortOrder"
          id="createdAt-asc"
          value="createdAt-asc"
          checked={sortedField === "createdAt" && sortedOrder === "asc"}
          onChange={() => handleSortChange("createdAt", "asc")}
        />
        <label htmlFor="createdAt-asc">Récent</label>
      </div>
      <div className="select">
        <input
          type="radio"
          name="sortOrder"
          id="createdAt-desc"
          value="createdAt-desc"
          checked={sortedField === "createdAt" && sortedOrder === "desc"}
          onChange={() => handleSortChange("createdAt", "desc")}
        />
        <label htmlFor="createdAt-desc">Moins récent</label>
      </div>
    </div>
  );

  const genreDisplay =
    allGenre &&
    allGenre.map((col, index) => (
      <div className="priceBlock">
        <div key={index} className="select">
          <input
            type="checkbox"
            name="genre"
            id={`colors-${col}`}
            value={col}
            checked={sortGenre.includes(col)}
            onChange={handleSortByGenres}
          />
          <label htmlFor={`colors-${col}`}>{col}</label>
        </div>
      </div>
    ));

  return (
    <>
      {/* HEADER */}
      <Header
        descriptionColor=""
        gradientCode={"rgba(6, 7, 7, 0) 10%, rgb(6, 6, 7)"}
        backgroundImage="https://images.pexels.com/photos/6863081/pexels-photo-6863081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        color="white"
      >
        <Navbar />
        <div className="headContainer">
          <div class="info">
            <strong className="numIndex">#01</strong>
            <span className="line" />
            <p>Get your music from youtube and create your best playlist</p>
          </div>
          <h2 className="title" style={{ color: "black" }}>
            <ImYoutube className="iconeYoutube" />
            Youtube <span className="strokeTitle">to playlist</span>
          </h2>

          {/* FORMS */}
          <form className="forms" onSubmit={handleSubmit}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              required
            />
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter Genre"
              required
            />
            <button type="submit">
              {loadCreateSong ? "Creating..." : "Add a song"}
            </button>
          </form>
          <form className="forms" onSubmit={handleSearchChange}>
            {/* <BsSearch className='icone' /> */}
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <button type="submit">Search song</button>
          </form>
          <form className="forms" onSubmit={handleSearchArtiste}>
            {/* <BsSearch className='icone' /> */}
            <input
              type="text"
              placeholder="Rechercher par artiste..."
              value={searchArtiste}
              onChange={(e) => setSearchArtiste(e.target.value)}
            />
            <button type="submit">Search artiste</button>
          </form>
          {message && message.error ? (
              <p className="alert alert-danger">{message && message.error}</p>
          ) : (
            ""
          )}
        </div>
        {/* PLAYER */}
        <AudioPlayer
          songPlayer={playlist}
          isPlaying={isPlaying[currentSong]}
          setIsPlaying={setIsPlaying}
          currentSongIndex={currentSong}
          setCurrentSongIndex={setCurrentSong}
          audioRef={audioRefs}
          handlePlayPause={handlePlayPause}
          playlistSongs={playlistSongs}
          currentAlbum={currentAlbum}
          setCurrentAlbum={setCurrentAlbum}
        />
      </Header>

      {/* CONTENU */}
      <div className="section-container">
        <div className="custom-container ">
          <div className="formContainer col-10">
            {/* TITLE CONTAINER */}
            <div className="titleContainer">
              <h2>Liste de musique</h2>
            </div>

            <div className="filter">
              {/* FILTER */}
              <ul style={{ display: "flex" }} className="displayed-container">
                <ul className="selector selBis">
                  <h3>
                    <RiFilterFill className="icone" />
                    Filtres
                  </h3>
                </ul>
                <ul className="selector">
                  <h3
                    onClick={() => setToogleTri((prevToogleTri) => !toogleTri)}
                  >
                    Trier
                    {toogleTri ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </h3>
                  <ul
                    className="blockTri"
                    style={{ display: toogleTri ? "block" : "none" }}
                  >
                    {orderDisplay}
                  </ul>
                </ul>
                <ul className="selector">
                  <h3
                    onClick={() =>
                      setToogleGenre((prevToogleGenre) => !toogleGenre)
                    }
                  >
                    Genres
                    {toogleGenre ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </h3>
                  <ul
                    className="blockGenre"
                    style={{ display: toogleGenre ? "block" : "none" }}
                  >
                    <div className="genreContainer">{genreDisplay}</div>
                  </ul>
                </ul>
              </ul>
              <button onClick={clearAll}>
                <RiDeleteBin6Line />
                <span>Tout effacer</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="infoSong">
              <p>Il y'a {total && total} resultats</p>
            </div>
            {/* LIST SONG */}
            <div className="song-list">
              {playlist && playlist.length > 0 ? (
                playlist.map((song, index) => (
                  <div className="song-item" key={index}>
                    <div className="song-index">{index + 1}</div>
                    <div className="song-cover">
                      <img src={song.thumbnail} alt="music cover" />
                    </div>
                    <div className="song-details">
                      <Link to={song.url}>{song.name}</Link>
                      <div className="song-artist">{song.artiste}</div>
                      <div className="song-genre">{song.genre}</div>
                      <div className="song-duration">{song.duration}</div>
                    </div>
                    <div className="song-actions">
                      <ReactAudioPlayer
                        style={{ display: "none" }}
                        ref={audioRefs.current[index]}
                        src={song.file}
                        controls
                      />
                      <button
                        className="btn-play"
                        onClick={() => handlePlayPause(index)}
                      >
                        {isPlaying[index] ? <MdOutlinePause /> : <FaPlay />}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(song._id)}
                      >
                        <RiDeleteBin6Line />
                      </button>
                      <div className="action-block">
                        <button className="btn-add">
                          {loadingAddPlaylist && loadingSongId === song._id ? (
                            <span className="text">Adding...</span>
                          ) : (
                            <span className="text">Ajouter à la playlist</span>
                          )}{" "}
                          <LuPlus />
                        </button>
                        <div className="toggle">
                          <ul className="toggle-playlist">
                            {loadingPlaylist ? (
                              <p>Loading...</p>
                            ) : playlists && playlists.length > 0 ? (
                              playlists.map((pl) => (
                                <li
                                  key={pl._id}
                                  onClick={() =>
                                    handleAddToPlaylist(pl._id, song._id)
                                  }
                                >
                                  {pl.name}
                                </li>
                              ))
                            ) : (
                              <p>No playlists available</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-songs">No songs available</div>
              )}
            </div>
          </div>

          {/*  PLAYLIST  */}
          <CreatePlaylistForm />
          <PlaylistList
            handlePlaySong={handlePlaySong}
            isPlaying={albumPlaying}
            setPlaylistSong={setPlaylistSongs}
            playlists={playlists}
            setCreatedPlaylist={setCreatedPlaylist}
            createdPlaylist={createdPlaylist}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
