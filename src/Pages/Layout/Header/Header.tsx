import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [suggestions, setSuggestions] = useState<any>([]);
  const [inputDialog, setInputDialog] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const sentinelRef = useRef(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    dispatch(getGenreListAction({}));
  }, [dispatch]);

  useEffect(() => {
    let tempGenreList = genreListData?.genres?.map((el) => el.name) || [];
    setGenreList(tempGenreList);
  }, [genreListData]);

  const fetchDataFunc = (movie: string, page: number, mode: string) => {
    fetchData(
      `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&query=${movie}&page=${page}`
    )
      .then((data: any) => {
        if (mode === "start_new") {
          setSuggestions((prevArr) => {
            return [...data?.results];
          });
        } else {
          setSuggestions((prevArr) => {
            return [...prevArr, ...data?.results];
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setSuggestionLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prev) => {
            fetchDataFunc(inputMovie, prev + 1, "continue");
            return prev + 1;
          });
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [sentinelRef.current, inputMovie]);

  const searchClickHandler = (receivedId) => () => {
    setInputDialog(false);
    setSuggestions([]);
    setInputMovie("");
    navigate(`/MovieDetails/${receivedId}`);
  };

  const handleSearch = useDebounce((movie) => {
    setInputDialog(true);
    setSuggestions([]);
    setPageNumber(1);
    fetchDataFunc(movie, 1, "start_new");
  }, 500);

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMovie(event.target.value);
    setSuggestionLoading(true);

    // Debounce the search callback
    handleSearch(event.target.value);
  };

  const handleBlur = () => {
    if (!isMouseDown) {
      setInputDialog(false);
      setSuggestions([]);
    }
  };

  return (
    <div className={classes["header-container"]}>
      <div className={classes["header-logo-input-container"]}>
        <div className={classes["header-logo-container"]}>
          <Logo />
        </div>
        <div
          className={classes["header-input-container"]}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          <input
            value={inputMovie}
            onChange={valueChangeHandler}
            placeholder="Search"
            onBlur={handleBlur}
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
                    ref={suggestionRef}
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
              <div ref={sentinelRef} className={classes[""]}>
                {!suggestionLoading && suggestions?.length > 0 && (
                  <div className={classes["loader-container"]}>
                    <Loader color="black" height="30px" width="30px" />
                  </div>
                )}
              </div>
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
