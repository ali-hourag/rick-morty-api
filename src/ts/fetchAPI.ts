import { Episodes, Episode, Characters, Character, Locations, Location } from "./interface.js";



//Default page is 1 and there is no need to add ?page=2
//However if we want to access another one we have to pass its respective page
export async function getEpisodes(page: string = ""): (Promise<Episodes>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/episode${page}`);
    const episodes: Episodes = await res.json();
    return episodes;
}

export async function getEpisode(episodeNum: number): (Promise<Episode>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeNum.toString()}`);
    const episode: Episode = await res.json();
    return episode;
}

export async function getCharacters(page: string = ""): (Promise<Characters>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/character${page}`);
    const characters: Characters = await res.json();
    return characters;
}

export async function getCharacter(charNum: number): (Promise<Character>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/character/${charNum.toString()}`);
    const character: Character = await res.json();
    return character;
}

export async function getLocations(page: string = ""): (Promise<Locations>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/location${page}`);
    const locations: Locations = await res.json();
    return locations;
}

export async function getLocation(locationNum: number): (Promise<Location>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/location/${locationNum.toString()}`);
    const location: Location = await res.json();
    return location;
}
