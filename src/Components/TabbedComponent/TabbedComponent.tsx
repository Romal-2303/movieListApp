import React, { useState } from "react";
import classes from "./TabbedComponent.module.scss";
import styles from "../../DesignSystem/_classes.module.scss";

interface TabbedComponentProps {
  tabArr?: string[];
}

const TabbedComponent = ({
  tabArr = ["a", "b", "c"],
}: TabbedComponentProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabClickHandler = (receivedNumber: number) => () => {
    setActiveTab(receivedNumber);
  };

  return (
    <div
      className={`${classes["tabbed-component-container"]} ${styles["hide-scrollbar"]}`}
    >
      {tabArr.map((tab, index) => (
        <div
          key={index}
          className={
            activeTab === index
              ? `${classes["tab-element"]} ${classes["active-tab-element"]}`
              : `${classes["tab-element"]}`
          }
          onClick={tabClickHandler(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default TabbedComponent;
