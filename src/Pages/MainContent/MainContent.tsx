import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classes from "./MainContent.module.scss";
import styles from "../../DesignSystem/_classes.module.scss";
import Loader from "../../Components/Loader/Loader.tsx";
import Card from "../../Components/Card/Card.tsx";
import { useDispatch, useSelector } from "react-redux";
import { getMovieData } from "../../Redux/Slices/MovieList/getMovieData.slice.ts";
import { AppDispatch, RootState } from "../../Redux/store.ts";
import { selectMovieDataResponse } from "../../Redux/Slices/MovieList/getMovieData.selector.ts";
import { selectGenreListResponse } from "../../Redux/Slices/GenreList/getGenreList.selector.ts";

interface MainContentProps {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const MainContent = ({
  isLoading,
  startLoading,
  stopLoading,
}: MainContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [moviesDataObj, setMoviesDataObj] = useState<any>({});
  const [anchorYear, setAnchorYear] = useState(2012);
  const [anchorYearTop, setAnchorYearTop] = useState(2012);
  const [anchorYearBottom, setAnchorYearBottom] = useState(2012);
  const [fetchMode, setFetchMode] = useState<string>("top");
  const movieData = useSelector(selectMovieDataResponse);
  const genreListData = useSelector(selectGenreListResponse);
  const referenceYear = useRef<HTMLParagraphElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null); // Ref to main content container
  const sentinelRefBottom = useRef<HTMLDivElement>(null); // Ref to bottom sentinel element
  const sentinelRefTop = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);
  const initialLoadTop = useRef(true);

  const tempFilterData = useSelector(
    (state: RootState) => state.filterDataSlice.filterData
  );

  useEffect(() => {
    startLoading();

    dispatch(
      getMovieData({
        with_genres: tempFilterData?.join(",") || undefined,
        // primary_release_year: anchorYear,
        primary_release_year:
          fetchMode === "top" ? anchorYearTop : anchorYearBottom,
      })
    )
      .then(() => {
        // Adjust scroll position after loading new data
        setTimeout(() => {
          if (mainContentRef.current) {
            // Scroll to the bottom of the movies-list-container
            const moviesListContainer = mainContentRef.current.querySelector(
              `.${classes["movies-list-container"]}`
            );
            if (moviesListContainer) {
              moviesListContainer.scrollTop = moviesListContainer.scrollHeight;
            }
          }
        }, 100); // Adjust delay as needed
      })
      .catch(() => {})
      .finally(() => {
        stopLoading();
      });
  }, [anchorYearTop, anchorYearBottom]);

  useEffect(() => {
    if (movieData) {
      setMoviesDataObj((prevData) => ({
        ...prevData,
        [fetchMode === "top" ? anchorYearTop : anchorYearBottom]:
          movieData.results,
      }));
    }
  }, [movieData, anchorYearTop, anchorYearBottom, fetchMode]);

  useEffect(() => {
    setMoviesDataObj((prevObj) => {
      return { ...{ 2012: prevObj[2012] } };
    });

    initialLoad.current = true;
    initialLoadTop.current = true;

    setTimeout(() => {
      document.getElementById("2012")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setAnchorYearBottom(2012);
    setAnchorYearTop(2012);
    setAnchorYear(2012);
  }, [tempFilterData]);

  useEffect(() => {
    setTimeout(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 20, behavior: "smooth" });
      }
    }, 100); // Delay added to ensure rendering is complete
  }, []);

  useEffect(() => {
    const observerTop = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !initialLoadTop.current) {
          setAnchorYearTop((prev) => {
            return prev - 1;
          });
          setAnchorYear((prev) => {
            return prev - 1;
          });
          setFetchMode("top");
        }
        initialLoadTop.current = false;
      },
      { threshold: 0.1 }
    );

    if (sentinelRefTop.current) {
      observerTop.observe(sentinelRefTop.current);
    }

    return () => {
      if (sentinelRefTop.current) {
        observerTop.unobserve(sentinelRefTop.current);
      }
    };
  }, [sentinelRefTop]);

  useEffect(() => {
    const observerBottom = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !initialLoad.current) {
          setAnchorYearBottom((prev) => {
            return prev < 2024 ? prev + 1 : prev;
          });
          setAnchorYear((prev) => {
            return prev < 2024 ? prev + 1 : prev;
          });
          setFetchMode("bottom");
        }
        initialLoad.current = false;
      },
      { threshold: 1.0 }
    );

    if (sentinelRefBottom.current) {
      observerBottom.observe(sentinelRefBottom.current);
    }

    return () => {
      if (sentinelRefBottom.current) {
        observerBottom.unobserve(sentinelRefBottom.current);
      }
    };
  }, [sentinelRefBottom]);

  const genreIdToName = useMemo(() => {
    const mapping: { [key: number]: string } = {};
    genreListData?.genres.forEach((genre) => {
      mapping[genre.id] = genre.name;
    });
    return mapping;
  }, [genreListData]);

  const getMoviesWithGenres = useCallback(
    (movies) => {
      return movies.map((movie) => ({
        ...movie,
        genres_text: movie.genre_ids.map((id) => genreIdToName[id] || ""),
      }));
    },
    [genreIdToName]
  );

  console.log(anchorYearTop);

  return (
    <div
      className={`${classes["main-content-container"]} ${styles["hide-scrollbar"]}`}
      ref={mainContentRef}
    >
      <div ref={sentinelRefTop} className={classes["sentinel"]}>
        {isLoading && (
          <div className={classes["loader-container"]}>
            <Loader />
          </div>
        )}
      </div>
      {moviesDataObj &&
        Object.entries(moviesDataObj)?.map(([year, movies]: any) => (
          <React.Fragment key={year}>
            {year === "2012" ? (
              <p
                id="2012"
                className={classes["movie-year"]}
                ref={referenceYear}
              >
                {year}
              </p>
            ) : (
              <p className={classes["movie-year"]}>{year}</p>
            )}
            <div className={`${classes["movies-list-container"]}`}>
              {movies &&
                getMoviesWithGenres(movies).map((movie: any) => (
                  <div key={movie.id}>
                    <Card
                      movieId={movie?.id}
                      image={movie?.poster_path}
                      ratings={movie?.vote_average}
                      title={movie?.title}
                      desc={movie?.overview}
                      genres={movie?.genres_text}
                    />
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
      <div ref={sentinelRefBottom} className={classes["sentinel-bottom"]}>
        {isLoading && (
          <div className={classes["loader-container"]}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
