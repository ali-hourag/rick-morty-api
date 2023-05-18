import { Episodes, Episode, Character, Locations, Location } from "./interface.js";

/**
 * This file only has async functions that make fetch requests to the
 * Rick and Morty API
 */


//--------------------------------------------------------------------------------------------------------------------------------
/**
 * 
 * @param page if nothing is passed, then it is an empty string
 *      However, if we have a string it will be ?page=x
 *      x being the number of the page asked for
 *      an empty string represents the ?page=1
 *      Default page is 1 and there is no need to add ?page=2
 *      However if we want to access another one we have to pass its respective page
 * @returns the episodes in the page asked for
 */
export async function getEpisodes(page: string = ""): (Promise<Episodes>) {
    const res: Response = await fetch(`https://rickandmortyapi.com/api/episode${page}`);
    const episodes: Episodes = await res.json();
    return episodes;
}

//--------------------------------------------------------------------------------------------------------------------------------
/**
 * @param URL of the episode in the API to make the request
 *      if it is not passed (undefined), then the default value is the one
 *      below and will need of an id 
 *      However, if the URl already has an id, then the id param SHOULD NOT be called
 * 
 * @param id id of the character asked. Only passed as a parameter if URL undefined or has
 *          not an id already
 *      
 *      PRE: We can not have an URL with an id and an id param as well
 *      If we have an id, then the URL has to be undefined or without id
 * @returns returns the episode asked for in the URL
 */
export async function getEpisode(URL: string = "https://rickandmortyapi.com/api/episode", id: string = ""): (Promise<Episode>) {
    const res: Response = await fetch(`${URL}/${id}`);
    const episode: Episode = await res.json();
    return episode;
}
//--------------------------------------------------------------------------------------------------------------------------------
/**
 * @param URL of the character in the API to make the request
 *      if it is not passed (undefined), then the default value is the one
 *      below and will need of an id 
 *      However, if the URl already has an id, then the id param should not be called
 * @param id id of the character asked. Only passed as a parameter if URL undefined or has
 *          not an id already
 *      
 *      PRE: We can not have an URL with an id and an id param as well
 * If we have an id, then the URL has to be undefined or without id
 * @returns returns the character asked for in the URL
 */
export async function getCharacter(URL: string = "https://rickandmortyapi.com/api/character", id: string = ""): (Promise<Character>) {
    const res: Response = await fetch(`${URL}/${id}`);
    const character: Character = await res.json();
    return character;
}

//--------------------------------------------------------------------------------------------------------------------------------

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
