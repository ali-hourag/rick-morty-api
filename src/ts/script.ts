import { setHeader, setEpisodes, addEpisodes } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
import { Episodes } from "./interface.js";

window.addEventListener("load", pageLoaded);

async function pageLoaded(): Promise<void> {
    setHeader();
    const p: Episodes = await getEpisodes();
    setEpisodes();


}
