import React, { useEffect, useState } from "react";
import classes from "./MovieDetails.module.scss";
import styles from "../../DesignSystem/_classes.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store.ts";
import { getMovieDetailsAction } from "../../Redux/Slices/MovieDesc/getMovieDetails.slice.ts";
import { selectMovieDetailsResponse } from "../../Redux/Slices/MovieDesc/getMovieDetails.selector.ts";
import { getMovieCreditsAction } from "../../Redux/Slices/MovieCredits/getMovieCredits.slice.ts";
import { selectMovieCreditsResponse } from "../../Redux/Slices/MovieCredits/getMovieCredits.selector.ts";
import useLoader from "../../Hooks/useLoader.ts";
import Loader from "../../Components/Loader/Loader.tsx";
import { ReactComponent as BackArrow } from "../../assets/icons/backIcon.svg";

const MovieDetails = () => {
  const [movieDetails, setMovieDetails] = useState<any>({});
  const [movieCredits, setMovieCredits] = useState({});
  const [directorDetails, setDirectorDetails] = useState<any>({});
  const [castDetails, setCastDetails] = useState<any>([]);
  const { isLoading, startLoading, stopLoading } = useLoader();

  const naviage = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const movieDetailsData = useSelector(selectMovieDetailsResponse);
  const movieCreditsData = useSelector(selectMovieCreditsResponse);

  useEffect(() => {
    startLoading();
    dispatch(getMovieCreditsAction({ id: Number(id) }));
    dispatch(getMovieDetailsAction({ id: Number(id) })).finally(() => {
      stopLoading();
    });
  }, []);

  useEffect(() => {
    setMovieDetails(movieDetailsData);
  }, [movieDetailsData]);

  useEffect(() => {
    let tempDirectorDetails = movieCreditsData?.crew?.filter(
      (el) => el.job === "Director"
    );
    if (tempDirectorDetails && tempDirectorDetails.length > 0) {
      setDirectorDetails(tempDirectorDetails[0]);
    } else {
      setDirectorDetails({});
    }

    let tempCastDetails =
      movieCreditsData?.cast?.map((a) => {
        return { ...a };
      }) ?? [];

    tempCastDetails.sort((a, b) => b.popularity - a.popularity);

    setCastDetails(tempCastDetails.slice(0, 5));

    setMovieCredits(movieCreditsData);
  }, [movieCreditsData]);

  const backIconClickHandler = () => {
    naviage(`/`, {
      state: {},
    });
  };

  return (
    <>
      {isLoading ? (
        <div className={classes["loader-container"]}>
          <Loader />
        </div>
      ) : (
        <div
          className={`${classes["movie-info-container"]} ${styles["hide-scrollbar"]}`}
        >
          <div
            className={classes["back-icon-container"]}
            onClick={backIconClickHandler}
          >
            <BackArrow />
          </div>
          <div className={classes["movie-image-container"]}>
            <img
              src={`http://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`}
              alt="movie.jpg"
              height={"100%"}
              width={"100%"}
              className={classes["movie-img"]}
            />
          </div>
          <div className={classes["movie-desc-container"]}>
            <div className={classes["movie-title-container"]}>
              <p className={classes["movie-title"]}>{movieDetails?.title}</p>
              <p className={classes["movie-date"]}>
                {movieDetails?.release_date?.split("-")[0]}
              </p>
              <p className={classes["movie-genre"]}>
                {movieDetails?.genres?.map((el) => el.name).join("/ ")}
              </p>
            </div>
            <p className={classes["movie-overview"]}>
              {movieDetails?.overview}
            </p>
            <p className={classes["movie-imdb"]}>
              IMDB: {movieDetails?.vote_average?.toFixed(1)}
            </p>
          </div>
          <div className={classes["partitioner"]}></div>
          <div className={classes["movie-director-container"]}>
            <div className={classes["director-info-container"]}>
              <div className={classes["director-image-container"]}>
                <img
                  src={`http://image.tmdb.org/t/p/w500${directorDetails?.profile_path}`}
                  alt="director.jpg"
                  height={"100%"}
                  width={"100%"}
                  className={classes["movie-img"]}
                />
              </div>
              <div className={classes["director-details-container"]}>
                <p className={classes["director-name"]}>
                  {directorDetails?.name}
                </p>
                <p className={classes["director-text"]}>Director</p>
              </div>
            </div>
          </div>
          <div className={classes["movie-cast-container"]}>
            {castDetails.map((cast) => (
              <div className={classes["movie-cast-details-container"]}>
                <div className={classes["cast-image-container"]}>
                  <img
                    src={`http://image.tmdb.org/t/p/w500${cast?.profile_path}`}
                    alt="director.jpg"
                    height={"100%"}
                    width={"100%"}
                    className={classes["cast-img"]}
                  />
                </div>
                <div className={classes["cast-details-container"]}>
                  <p className={classes["cast-original-name"]}>{cast.name}</p>
                  <p className={classes["cast-character-name"]}>
                    {cast.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;
