declare module 'custom-project-typings' {
    export type Movie = {
        title: string,
        year: string,
        imdbId: string,
        type: string, 
        posterUrl: string
    }

    export type MovieDetailed = {
        title: string,
        year: number | {from: number, to: number},
        rated: string,

        season: number,
        episode: number,
        totalSeasons: number,

        // Cast the API's release date as a native JavaScript Date type.
        released: Date,

        // Return runtime as minutes casted as a Number instead of an
        // arbitrary string.
        runtime: number,

        countries: string[],
        genres: string[],
        director: string,
        writers: string[],
        actors: string[],
        plot: string,

        // A hotlink to a JPG of the movie poster on IMDB.
        poster: string,

        imdb: {
            id: string,
            rating: number,
            votes: number
        },

        metacritic: number,

        awards: {
            wins: number, 
            nominations: number,
            text: string
        },

        type: string
    }

    export type MovieSearchResult = Movie[]
}

