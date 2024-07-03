import React from "react";
import classes from "./TabbedComponent.module.scss";
import styles from "../../DesignSystem/_classes.module.scss";

interface TabbedComponentProps {
  tabArr?: string[];
  activeTab?: number[];
  setActiveTab?: any;
  mode?: "single" | "multiple";
}

const TabbedComponent = ({
  tabArr = ["a", "b", "c"],
  activeTab = [0],
  setActiveTab,
  mode = "single",
}: TabbedComponentProps) => {
  const handleSingleMode = (receivedNumber: number) => {
    setActiveTab?.([receivedNumber]);
  };

  const handleMultipleMode = (receivedNumber: number) => {
    let updatedTabs = [...activeTab];

    if (receivedNumber === 0) {
      setActiveTab?.([0]);
    } else {
      if (activeTab.includes(receivedNumber)) {
        updatedTabs = updatedTabs.filter((tab) => tab !== receivedNumber);
      } else {
        updatedTabs = updatedTabs.filter((tab) => tab !== 0);
        updatedTabs.push(receivedNumber);
      }

      if (updatedTabs.length === 0) {
        updatedTabs = [0];
      }

      setActiveTab?.(updatedTabs);
    }
  };

  const tabClickHandler = (receivedNumber: number) => () => {
    if (mode === "single") {
      handleSingleMode(receivedNumber);
    } else {
      handleMultipleMode(receivedNumber);
    }
  };

  // const tabClickHandler = (receivedNumber: number) => () => {
  //   if (mode === "single") {
  //     setActiveTab?.([receivedNumber]);
  //   } else {
  //     let uniqueArr: number[] = [...activeTab];

  //     if (receivedNumber === 0) {
  //       setActiveTab?.([0]);
  //     } else {
  //       if (!activeTab.includes(receivedNumber)) {
  //         uniqueArr = [...activeTab, receivedNumber];
  //       }
  //       if (activeTab.includes(receivedNumber)) {
  //         uniqueArr = uniqueArr.filter((el) => el !== receivedNumber);
  //       }
  //       if (activeTab.includes(0)) {
  //         uniqueArr = uniqueArr.filter((el) => el !== 0);
  //       }
  //       if (uniqueArr.length === 0) {
  //         setActiveTab?.([0]);
  //       } else {
  //         setActiveTab?.(uniqueArr);
  //       }
  //     }
  //   }
  // };

  return (
    <div
      className={`${classes["tabbed-component-container"]} ${styles["hide-scrollbar"]}`}
    >
      {tabArr.map((tab, index) => (
        <div
          key={index}
          className={
            activeTab.includes(index)
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
