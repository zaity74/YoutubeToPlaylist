// HOOKS
import React from "react";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// COMPOSANT IMPORT
import "../pages/Home.scss";

// REDUX IMPORT
import {
  allSongs,
  createSong,
  removeSong,
  clearAllSong,
} from "../Redux/Actions/songAction";

const Songs = () => {
  // STATE

  const [categoryTitle, setCategoryTitle] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [sortGenre, setSortGenre] = useState([]);
  const [searchArtiste, setSearchArtiste] = useState("");
  const [limitPage, setLimitPage] = useState(10);
  const [sortedField, setSortedField] = useState("title");
  const [sortedOrder, setSortedOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [songPerPage, setSongPerPage] = useState(0);
  const [nextPage, setNextPage] = useState(0);

  const [url, setUrl] = useState("");
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(0);
  const [allGenre, setAllGenre] = useState([]);

  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");
  const [playlist, setPlaylist] = useState([]);

  // DATA RESPONSE AND USE CONSTANTE
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading, song } = useSelector((state) => state.fetchAllSong);
  const songs = song && song.songs;

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

    const limit = queryParams.get("limit") || 5;
    setLimitPage(limit);

    const sortOrder = queryParams.get("sortOrder") || "asc";
    setSortedOrder(sortOrder);

    // FETCH ALL SONGS
    const fetchAllSongs = async () => {
      try {
        await dispatch(
          allSongs({page, title, genre, artiste, sortField, sortOrder, limit})
        );
      } catch (error) {
        setMessage("Error fetching all the video");
        console.error("handleSubmit error:", error);
      }
    };
    fetchAllSongs();
  }, [location.search, dispatch]);

  // EFFECTS 2
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

  // EFFECTS 3
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

  // FUNCTIONS
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        createSong({
          url,
          description,
          genre,
        })
      );

      console.log("show me the response : ", response.data);
      setMessage(response.data.msg); // Adjust to match the API response key
      setUrl("");
      setDescription("");
      setGenre("");
    } catch (error) {
      setMessage("Error downloading the video");
      console.error("handleSubmit error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(removeSong(id));
    } catch (error) {
      setMessage("Error deleting the video");
      console.error("handleDelete error:", error);
    }
  };

  const clearAll = async () => {
    try {
      await dispatch(clearAllSong());
    } catch (error) {
      setMessage("Error clearing the playlist");
      console.error("handleDelete error:", error);
    }
  };

  const handleSearchChange = (event) => {
    event.preventDefault();
    const newTitle = event.target.value;
    setSearchTitle(newTitle);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("title", newTitle);
    navigate({ search: queryParams.toString() });
  };

  const handleSearchArtiste = (event) => {
    event.preventDefault();
    const newArtiste = event.target.value;
    setSearchTitle(newArtiste);
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
      <div key={index} className="priceBlock">
        <div className="priceBlock">
          <div className="select">
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
      </div>
    ));

  return (
    <>
      <Navbar />
      <div className="section-container">
        <div className="custom-container ">
          <div className="formContainer col-10">
            <div>
              <h1>YouTube to Playlist</h1>
              <form onSubmit={handleSubmit}>
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
                <button type="submit">Add to Playlist</button>
              </form>
              {message && <p>{message}</p>}
              {/* FILTER */}
              <div style={{ display: "flex" }} className="searchContainer">
                <form className="search">
                  {/* <BsSearch className='icone' /> */}
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchTitle}
                    onChange={handleSearchChange}
                  />
                </form>
                <form className="search">
                  {/* <BsSearch className='icone' /> */}
                  <input
                    type="text"
                    placeholder="Rechercher par artiste..."
                    value={searchArtiste}
                    onChange={handleSearchArtiste}
                  />
                </form>
              </div>
              <ul style={{ display: "flex" }} className="displayed-container">
                <ul className="selector">
                  <h3>
                    Trier
                    {/* <BsPlusLg className='icone' /> */}
                  </h3>
                  <ul className="block">{orderDisplay}</ul>
                </ul>
                <ul className="selector">
                  <h3>
                    Genres
                    {/* <BsPlusLg className='icone' /> */}
                  </h3>
                  <ul className="block">{genreDisplay}</ul>
                </ul>
              </ul>

              {/* TITLE CONTAINER */}
              <div className="titleContainer">
                <h2>Playlist</h2>
                <button onClick={clearAll}>Tout effacer</button>
              </div>

              <div className="info">
                <p>Il y'a {total && total} resultats</p>
              </div>
              {/* TABLE */}
              {songs &&
                songs.map((song, index) => (
                  <div key={index}>
                    <h1>{song.name}</h1>
                    <button onClick={() => handleDelete(song._id)}>Supprimer</button>
                  </div>
                ))}
            </div>
          </div>
          <div className="pagination">
            <p>Pages : </p>
            {currentPage > 1 && (
              <button
                className="chevrons"
                onClick={() => goToPage(currentPage - 1)}
              >
                Prev
              </button>
            )}
            {songPerPage &&
              songPerPage.map(
                (pageData) =>
                  pageData.count > 0 && (
                    <button
                      key={pageData.page}
                      onClick={() => goToPage(pageData.page)}
                      className={
                        currentPage === pageData.page ? "selected" : ""
                      }
                    >
                      {pageData.page}
                    </button>
                  )
              )}
            {currentPage < nextPage && (
              <button
                className="chevrons"
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Songs;
