import React, { useEffect, useState } from "react";
import classes from "./MainContent.module.scss";
import styles from "../../DesignSystem/_classes.module.scss";
import Loader from "../../Components/Loader/Loader.tsx";
import Card from "../../Components/Card/Card.tsx";
import { useDispatch, useSelector } from "react-redux";
import { getMovieData } from "../../Redux/Slices/MovieList/getMovieData.slice.ts";
import { AppDispatch } from "../../Redux/store.ts";
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
  const [moviesDataList, setMoviesDataList] = useState<any[]>([]);
  const movieData = useSelector(selectMovieDataResponse);
  const genreListData = useSelector(selectGenreListResponse);

  useEffect(() => {
    startLoading();
    dispatch(getMovieData({}))
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        stopLoading();
      });
  }, []);

  useEffect(() => {
    setMoviesDataList(movieData?.results ?? []);
  }, [movieData]);

  useEffect(() => {
    let tempMoviesDataList = movieData?.results?.map((a) => {
      return { ...a };
    });

    let tempGenreList = genreListData?.genres ?? [];

    tempMoviesDataList =
      tempMoviesDataList?.map((movie) => {
        let tempGenresArr: any[] = [];
        movie.genre_ids.forEach((genreId: number) => {
          tempGenresArr.push(
            tempGenreList.find((genre) => genre.id === genreId)?.name
          );
        });

        return { ...movie, genres_text: [...tempGenresArr] };
      }) ?? [];

    setMoviesDataList((prev) => {
      return [...tempMoviesDataList];
    });
  }, [movieData, genreListData]);

  return (
    <div
      className={`${classes["main-content-container"]} ${styles["hide-scrollbar"]}`}
    >
      <p className={classes["movie-year"]}>2012</p>
      <div className={`${classes["movies-list-container"]}`}>
        {isLoading && (
          <div className={classes["loader-container"]}>
            <Loader />
          </div>
        )}
        {!isLoading &&
          moviesDataList &&
          moviesDataList.map((movie: any) => (
            <div>
              <Card
                image={movie?.poster_path}
                ratings={movie?.vote_average}
                title={movie?.title}
                desc={movie?.overview}
                genres={movie?.genres_text}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainContent;
