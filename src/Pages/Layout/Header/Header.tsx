import React from "react";
import classes from "./Header.module.scss";
import { ReactComponent as Logo } from "../../../assets/icons/Group.svg";
import TabbedComponent from "../../../Components/TabbedComponent/TabbedComponent.tsx";

const Header = () => {
  return (
    <div className={classes["header-container"]}>
      <div className={classes["header-logo-container"]}>
        <Logo />
      </div>
      <div className={classes["header-tabbed-container"]}>
        <TabbedComponent
          tabArr={["All", "Action", "Comedy", "Horror", "Drama", "Scifi"]}
        />
      </div>
    </div>
  );
};

export default Header;
