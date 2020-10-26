declare module 'custom-project-typings' {
    export type Movie = {
        title: string,
        year: string,
        imdbId: string,
        type: string, 
        posterUrl: string
    }

    export type MovieSearchResult = Movie[]
}

