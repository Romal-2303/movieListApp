import React, { useEffect, useState } from "react";
import classes from "./MainContent.module.scss";
import { fetchData } from "../../services/apiService.ts";
import { getMovieList } from "../../services/config.ts";
import useLoader from "../../Hooks/useLoader.ts";
import Loader from "../../Components/Loader/Loader.tsx";

const MainContent = () => {
  const [moviesDataList, setMoviesDataList] = useState([]);
  const { isLoading, startLoading, stopLoading } = useLoader();

  useEffect(() => {
    startLoading();
    fetchData(getMovieList("popularity.desc", 2012, 1, 100))
      .then((data: any) => {
        setMoviesDataList(data?.results ?? []);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoading();
      });
  }, []);

  console.log(moviesDataList);

  return (
    <div className={classes["movies-list-container"]}>
      {isLoading && (
        <div className={classes["loader-container"]}>
          <Loader />
        </div>
      )}
      {!isLoading &&
        moviesDataList &&
        moviesDataList.map((movie: any) => <div>{movie.title}</div>)}
    </div>
  );
};

export default MainContent;
