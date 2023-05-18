import { setHeader } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
import { Episodes } from "./interface.js";
import { infiniteScrollSB, addEpisodes } from "./functions.js";

//Function called when the page is loaded.
window.addEventListener("load", pageLoaded);

async function pageLoaded(): Promise<void> {
    //Clear session storage from possible data entered before.
    //It will be needed if the page is refreshed and data has been stored in session storage
    sessionStorage.clear();
    //Set HTML
    setHeader();
    //Add episodes to the episodes bar after getting the fetch of episodes
    const episodes: Episodes = await getEpisodes();
    addEpisodes(episodes.results);

    //Event listener to the sidebar to make it infinite
    const episodesContainer = document.querySelector(".episodes-bar-container") as HTMLDivElement;
    episodesContainer.addEventListener("scroll", infiniteScrollSB);

}