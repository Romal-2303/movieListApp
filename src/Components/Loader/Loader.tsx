import React from "react";
import classes from "./Loader.module.scss";

interface LoaderProps {
  color?: string;
  width?: string;
  height?: string;
}

const Loader = ({
  color = "#ffffff",
  width = "40px",
  height = "40px",
}: LoaderProps) => {
  return (
    <div className={classes["loader-container"]}>
      <span
        className={classes["loader"]}
        style={{
          borderTop: `3px solid ${color}`,
          width: width,
          height: height,
        }}
      />
    </div>
  );
};

export default Loader;
