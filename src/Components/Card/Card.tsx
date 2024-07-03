import React, { useState } from "react";
import classes from "./Card.module.scss";
import { useNavigate } from "react-router-dom";

const Card = ({
  title = "Don't Breathe",
  ratings = 8,
  image,
  desc = "",
  genres = [],
}) => {
  const naviage = useNavigate();
  const [cardClicked, setCardClicked] = useState(false);

  const cardClickHandler = () => {
    setCardClicked((prev) => !prev);
  };

  const detailsClickHandler = () => {
    console.log("Clicked");
    naviage("/MovieDetails?id=123", {
      state: {},
    });
  };

  return (
    <div className={`${classes["card-container"]}`} onClick={cardClickHandler}>
      <div className={classes["card-maincontent"]}>
        <img
          src={`http://image.tmdb.org/t/p/w500${image}`}
          alt="movie.jpg"
          height={"100%"}
          width={"100%"}
          className={classes["movie-img"]}
        />
      </div>
      {cardClicked && <div className={classes["card-screen"]}></div>}
      {cardClicked && (
        <div className={classes["card-footer"]}>
          <div className={classes["movie-desc"]}>
            {/* <p className={classes["desc"]}>{desc}</p> */}
            <p className={classes["genres-container"]}>
              <p className={classes["gen-element"]}>{genres.join(", ")}</p>
            </p>
            <div className={classes["details-btn-container"]}>
              <button onClick={detailsClickHandler}>View Details</button>
            </div>
          </div>
          <div className={classes["titleAndRatings"]}>
            <p className={classes["title"]}>{title}</p>
            <p className={classes["ratings"]}>{ratings.toFixed(1)} / 10</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
