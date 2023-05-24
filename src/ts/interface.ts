/**
 * In this file we have the different types defined
 * of the different objects.
 * They will be assigned to the objects obtained
 * after making requests to the API
 */

export interface Info {
    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: null | string;
    }
}

export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: Array<string>;
    url: string;
    created: string;
}

export interface Episodes extends Info {
    results: Array<Episode>;
}

enum statusCharacter { "Alive", "Dead", "unknown" };
enum genderCharacter { "Female", "Male", "Genderless", "unknown" };

export interface Character {
    id: number;
    name: string;
    status: statusCharacter;
    species: string;
    type: string;
    gender: genderCharacter;
    origin: {
        name: string;
        url: string;
    }
    location: {
        name: string;
        url: string;
    }
    image: string;
    episode: Array<string>;
    url: string;
    created: string;
}

export interface Characters extends Info {
    results: Array<Character>;
}

export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: Array<string>;
    url: string;
    created: string;
}

export interface Locations extends Info {
    residents: Array<Location>;
}
