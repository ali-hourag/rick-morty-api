
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
    airDate: string;
    episodeCode: string;
    characters: Array<string>;
    url: string;
    created: string;
}

export interface Episodes extends Info {
    results: Array<Episode>;
}

export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
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
    residents: Array<Character>;
    url: string;
    created: string;
}

export interface Locations extends Info {
    residents: Array<Location>;
}
