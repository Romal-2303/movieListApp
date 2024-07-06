import React from "react";
import Layout from "./Pages/Layout/Layout.tsx";
import classes from "./App.module.scss";
import useLoader from "./Hooks/useLoader.ts";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { routes } from "./Pages/Routes/routeConfig.tsx";

const App = () => {
  const { isLoading, startLoading, stopLoading } = useLoader();

  return (
    <div className={classes["main-container"]}>
      <Router>
        <Layout startLoading={startLoading} stopLoading={stopLoading}>
          <Routes>
            {routes.map((route) => {
              const Component = route.component;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Component
                      isLoading={isLoading}
                      startLoading={startLoading}
                      stopLoading={stopLoading}
                    />
                  }
                />
              );
            })}
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
