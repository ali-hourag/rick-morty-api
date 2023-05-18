import { locationClicked, addEpisodes, episodeClicked, characterClicked } from "./functions.js";
import { Episodes } from "./interface.js";
import { getEpisodes } from "./fetchAPI.js";


//------------------------------------------------------------------------------------------------------------
/**
 * Sets active class to the respective class in the breadcrumb indicating in which
 * part of the web we are situated
 * @param activeItem receives a number indicating where we are
 *  if activeItem === 0, then class active will be added to episodes
 * else if activeItem === 1, then class active will be added to characters
 * else if activeItem === 2, then class active will be added to locations
 */
export function setBreadcrumb(activeItem: (0 | 1 | 2)): void {
    const breadcrumbItems: NodeListOf<HTMLLIElement> = document.querySelectorAll(".breadcrumb-item");
    breadcrumbItems.forEach((breadcrumbItem: HTMLLIElement): void => {
        if (breadcrumbItem.classList.contains("active")) breadcrumbItem.classList.remove("active");
    });
    breadcrumbItems[activeItem].classList.add("active");
}
//------------------------------------------------------------------------------------------------------------
/**
 * If an episode is clicked, a class named active is added which gives a stronger background
 * so that it is highlighted. 
 * This function removes that if any episode in the sidebar has it
 */
export function removeEpisodeSelected(): void {
    const episodesSideBar: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".episode-link");
    episodesSideBar.forEach((episode: HTMLAnchorElement): void => {
        if (episode.classList.contains("active")) episode.classList.remove("active");
    })
}
//------------------------------------------------------------------------------------------------------------
/**
 * This functions is an EventListener.
 * Does not receive anything.
 * Does not return anything.
 */
export async function infiniteScrollSB(): Promise<void> {
    const episodesContainer = document.querySelector(".episodes-bar-container") as HTMLElement;

    //scrollWidth: actual width of the content
    //clientWidth: actual width of the part of the container that can be seen
    //scrollLeft: width of the part of the content that has been scrolled
    //if the scroll reaches the end, then scrollWidth = clientWidth + scrollLeft
    //offseetWidth is not being used since there is no border or padding.
    if (episodesContainer.scrollWidth - episodesContainer.clientWidth < episodesContainer.scrollLeft + 2) {


        //The endScroll item controlls that this change is not done constantly if the user is scrolling too fast.
        //End scroll is put on false when all the data is fetched and showed. When the data is being fetched or
        //showed, then endScroll is put on true and it won't enter this function, and hence, not make changes.
        //It is on true as well when all the episodes have been loaded and there is nothing more to make a request to.
        if (sessionStorage.getItem("endScroll") === "false") {
            sessionStorage.setItem("endScroll", "true"); //Set it on true to prevent scrolling while adding elements
            let actualPage: (string | null) = sessionStorage.getItem("page");
            if (actualPage === null) return;
            //Fetch of the respective page of the API
            let pageLoaded: number = parseInt(actualPage) + 1;
            if (pageLoaded === 3) removeEventListenerScroll();
            const episodes: Episodes = await getEpisodes(`?page=${pageLoaded.toString()}`);
            addEpisodes(episodes.results); //Add it to the sidebar
        }
    }
}
//------------------------------------------------------------------------------------------------------------
/**
 * This function does not receive or return anything.
 * It removes two eventListeners for the next reasons:
 * Remove EventListeners from the paragraphs that link to the locationClicked function that
 * calls this function. If they are not removed, we will keep adding eventListeners.
 * And if the origin is unknown it will link to the previous origin clicked, when it should not
 * link to any location.
 * This is why it is important to remove these eventListeners.
 * Other eventListeners have not been removed because those elements get removed and replaced by others
 * and after removing the element, naturally the eventListener does too.
 */
export function removeLocationEventListener() {
    const p2CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-origin");
    const p3CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-actual");
    if (p2CS === null) return;
    if (p3CS === null) return;
    if (p2CS.getAttribute("origin-url") !== null) p2CS.removeEventListener("click", locationClicked);
    if (p3CS.getAttribute("location-url") !== null) p3CS.removeEventListener("click", locationClicked);
}
//------------------------------------------------------------------------------------------------------------
/**
 * Removes eventListener from scroll when it is no longer needed.
*/
function removeEventListenerScroll() {
    const episodesContainer: (HTMLDivElement | null) = document.querySelector(".episodes-bar-container");
    if (episodesContainer === null) return;
    episodesContainer.removeEventListener("scroll", infiniteScrollSB);
}
//------------------------------------------------------------------------------------------------------------
/**
 * Removes eventListener from cards of episodes when it is no longer needed.
*/
export function removeEventListenersCardsEpisodes() {
    const cardsEpisodesContainers: NodeListOf<HTMLDivElement> = document.querySelectorAll(".episode-card-character-selected");
    cardsEpisodesContainers.forEach(cardEpisode => cardEpisode.removeEventListener("click", episodeClicked));
}
//------------------------------------------------------------------------------------------------------------
/**
 * Removes eventListener from cards of characters when it is no longer needed.
*/
export function removeCardCharacterContainerEventListener() {
    const cardCharacterContainer: NodeListOf<HTMLDivElement> = document.querySelectorAll(".card-character-container");
    cardCharacterContainer.forEach(cardCharacter => cardCharacter.removeEventListener("click", characterClicked));
}