import { setHeader } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
import { Episodes } from "./interface.js";
import { addEpisodes } from "./functions.js";
import { infiniteScrollSB } from "./supportFunctions.js";

window.addEventListener("load", pageLoaded);

/**
 * Function without param or return.
 * Called when the page is loaded and prepares the
 * web so that it is ready to run by using
 * other funcionts.
 */
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
    const episodesContainer: (HTMLDivElement | null) = document.querySelector(".episodes-bar-container");
    if (episodesContainer === null) return;
    episodesContainer.addEventListener("scroll", infiniteScrollSB);

}