import React from "react";
import Layout from "./Pages/Layout/Layout.tsx";
import MainContent from "./Pages/MainContent/MainContent.tsx";

const App = () => {
  return (
    <div className="App">
      <Layout>
        <MainContent />
      </Layout>
    </div>
  );
};

export default App;
