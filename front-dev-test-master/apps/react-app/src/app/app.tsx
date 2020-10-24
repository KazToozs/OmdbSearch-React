import React from 'react';

import './app.scss';

class Omdb {

  // Function to recover movies from API
  // We URI encode the string recovered from the search bar before performing a fetch
  async getMovies(search: string) {
    let encodedSearch : string = encodeURIComponent(search)
    let searchResponse = await fetch("http://www.omdbapi.com/?apikey=23aaa32&s=" + encodedSearch)
    let movies = await searchResponse.json()
    console.log(movies)
    return movies
  }
}

type Movie = {
  posterUrl : String;
  title : string;
  type : string;
  year : string;
  imdbId : string;
};

type MovieSearchResult = Movie[];

export const App = () => {
  let omdb : Omdb = new Omdb
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.scss file.
   */
  let movies = omdb.getMovies("test")
  return <div className="app"></div>;
};

export default App;
