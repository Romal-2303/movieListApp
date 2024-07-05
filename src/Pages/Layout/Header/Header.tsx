import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { ReactComponent as Logo } from "../../../assets/icons/logo.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icons/searchIcon.svg";
import TabbedComponent from "../../../Components/TabbedComponent/TabbedComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../Redux/store.ts";
import { selectGenreListResponse } from "../../../Redux/Slices/GenreList/getGenreList.selector.ts";
import { getGenreListAction } from "../../../Redux/Slices/GenreList/getGenreList.slice.ts";
import { getMovieData } from "../../../Redux/Slices/MovieList/getMovieData.slice.ts";
import { setFilterData } from "../../../Redux/Slices/filterSlice/filter.slice.ts";
import useDebounce from "../../../Hooks/useDebounce.ts";
import { fetchData } from "../../../Api/apiService.ts";
import Loader from "../../../Components/Loader/Loader.tsx";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  startLoading: () => void;
  stopLoading: () => void;
}

const Header = ({ startLoading, stopLoading }: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const genreListData = useSelector(selectGenreListResponse);
  const navigate = useNavigate();
  const [genreList, setGenreList] = useState([]);
  const [activeTab, setActiveTab] = useState<number[]>([0]);
  const [inputMovie, setInputMovie] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [inputDialog, setInputDialog] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  useEffect(() => {
    dispatch(getGenreListAction({}));
  }, []);

  useEffect(() => {
    let tempGenreList = genreListData
      ? genreListData?.genres?.map((el) => el.name)
      : [];

    setGenreList(tempGenreList);
  }, [genreListData]);

  const searchClickHandler = (receivedId) => () => {
    console.log(receivedId);
    setInputDialog(false);
    setSuggestions([]);
    navigate(`/MovieDetails/${receivedId}`);
  };

  const valueChangeHandler = (event) => {
    const { value } = event.target;
    setInputMovie(value);
    setSuggestionLoading(true);

    // Debounce the search callback
    handleSearch(value);
  };

  const handleSearch = useDebounce((movie) => {
    setInputDialog(true);
    // curl -X GET "https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=Inception"

    fetchData(
      `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&query=${movie}`
    )
      .then((data: any) => {
        console.log(data?.results);
        setSuggestions(data?.results);
      })
      .catch((err) => {})
      .finally(() => {
        setSuggestionLoading(false);
      });

    console.log("Searching for:", movie);
  }, 500);

  return (
    <div className={classes["header-container"]}>
      <div className={classes["header-logo-input-container"]}>
        <div className={classes["header-logo-container"]}>
          <Logo />
        </div>
        <div className={classes["header-input-container"]}>
          <input
            value={inputMovie}
            onChange={valueChangeHandler}
            placeholder="Search"
          />
          <div
            className={classes["search-icon-container"]}
            // onClick={searchClickHandler}
          >
            <SearchIcon />
          </div>
          {inputDialog && (
            <div className={classes["suggestion-container"]}>
              {!suggestionLoading &&
                suggestions &&
                suggestions?.map((el: any, index: number) => (
                  <div
                    key={index}
                    className={classes["suggestion-item"]}
                    onClick={searchClickHandler(el.id)}
                  >
                    <div className={classes["suggestion-item-image-container"]}>
                      <img
                        src={`http://image.tmdb.org/t/p/w500/${el?.poster_path}`}
                        width={"100%"}
                        height={"100%"}
                      />
                    </div>
                    <div className={classes["suggestion-item-title"]}>
                      <p>{el?.title}</p>
                      <p className={classes["suggestion-item-year"]}>
                        {el?.release_date?.split("-")?.[0]}
                      </p>
                    </div>
                  </div>
                ))}
              {!suggestionLoading &&
                suggestions &&
                suggestions.length === 0 && (
                  <div className={classes["not-found"]}>No result found</div>
                )}
              {suggestionLoading && (
                <div className={classes["loader-container"]}>
                  <Loader color="black" height="30px" width="30px" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={classes["header-tabbed-container"]}>
        <TabbedComponent
          tabArr={["All", ...genreList]}
          activeTab={activeTab}
          mode="multiple"
          setActiveTab={(recIndexArr) => {
            startLoading();
            if (recIndexArr.includes(0)) {
              dispatch(setFilterData([]));
              dispatch(getMovieData({})).finally(() => stopLoading());
            } else {
              let idString = recIndexArr.map(
                (el) => genreListData?.genres[el - 1]?.id
              );

              dispatch(setFilterData(idString));

              dispatch(
                getMovieData({
                  primary_release_year: 2012,
                  with_genres: idString.join(","),
                })
              ).finally(() => stopLoading());
            }

            setActiveTab(recIndexArr);
          }}
        />
      </div>
    </div>
  );
};

export default Header;
