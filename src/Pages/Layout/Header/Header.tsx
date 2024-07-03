import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { ReactComponent as Logo } from "../../../assets/icons/logo.svg";
import TabbedComponent from "../../../Components/TabbedComponent/TabbedComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../Redux/store.ts";
import { selectGenreListResponse } from "../../../Redux/Slices/GenreList/getGenreList.selector.ts";
import { getGenreListAction } from "../../../Redux/Slices/GenreList/getGenreList.slice.ts";
import { getMovieData } from "../../../Redux/Slices/MovieList/getMovieData.slice.ts";
import useLoader from "../../../Hooks/useLoader.ts";
import { setFilterData } from "../../../Redux/Slices/filterSlice/filter.slice.ts";

interface HeaderProps {
  startLoading: () => void;
  stopLoading: () => void;
}

const Header = ({ startLoading, stopLoading }: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const genreListData = useSelector(selectGenreListResponse);
  const [genreList, setGenreList] = useState([]);
  const [activeTab, setActiveTab] = useState<number[]>([0]);

  useEffect(() => {
    dispatch(getGenreListAction({}));
  }, []);

  useEffect(() => {
    let tempGenreList = genreListData
      ? genreListData?.genres?.map((el) => el.name)
      : [];

    setGenreList(tempGenreList);
  }, [genreListData]);

  return (
    <div className={classes["header-container"]}>
      <div className={classes["header-logo-container"]}>
        <Logo />
      </div>
      <div className={classes["header-tabbed-container"]}>
        <TabbedComponent
          tabArr={["All", ...genreList]}
          activeTab={activeTab}
          mode="multiple"
          setActiveTab={(recIndexArr) => {
            startLoading();
            if (recIndexArr.includes(0)) {
              dispatch(getMovieData({})).finally(() => stopLoading());
            } else {
              let idString = recIndexArr.map(
                (el) => genreListData?.genres[el - 1]?.id
              );

              dispatch(setFilterData(idString));

              dispatch(
                getMovieData({
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
