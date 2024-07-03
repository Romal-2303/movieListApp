import React from "react";
import MainContent from "../MainContent/MainContent.tsx";
import useLoader from "../../Hooks/useLoader.ts";
import MovieDetails from "../MovieDetails/MovieDetails.tsx";

type typeRoutesConfig = {
  path?: string | undefined;
  component: React.ElementType;
};

export const routes: typeRoutesConfig[] = [
  {
    path: "/",
    component: MainContent,
  },
  {
    path: "/MovieDetails/:id",
    component: MovieDetails,
  },
];
