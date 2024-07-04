const getMovieList = (
  sort_by: string = "popularity.desc",
  primary_release_year: number = 2012,
  primary_release_year_lte: string = "2012-12-31",
  primary_release_year_gte: string = "2012-01-01",
  page: number = 1,
  vote_count_gte: number = 100,
  with_genres?: string
) => {
  return `https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=${sort_by}&primary_release_year=${primary_release_year}&page=${page}&vote_count.gte=${vote_count_gte}${
    with_genres ? `&with_genres=${with_genres}` : ""
  }`;
};

const getGenreList = () => {
  return `https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d&language=en-US`;
};

const getMovieDetails = (id: number) => {
  return `https://api.themoviedb.org/3/movie/${id}?api_key=2dca580c2a14b55200e784d157207b4d`;
};

const getMovieCredits = (id: number) => {
  return `https://api.themoviedb.org/3/movie/${id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`;
};

const path = {
  getMovieList,
  getGenreList,
  getMovieDetails,
  getMovieCredits,
};

export default path;
