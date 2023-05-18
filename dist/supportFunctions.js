var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { locationClicked, addEpisodes, episodeClicked, characterClicked } from "./functions.js";
import { getEpisodes } from "./fetchAPI.js";
export function setBreadcrumb(activeItem) {
    const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
    breadcrumbItems.forEach((breadcrumbItem) => {
        if (breadcrumbItem.classList.contains("active"))
            breadcrumbItem.classList.remove("active");
    });
    breadcrumbItems[activeItem].classList.add("active");
}
export function removeEpisodeSelected() {
    const episodesSideBar = document.querySelectorAll(".episode-link");
    episodesSideBar.forEach((episode) => {
        if (episode.classList.contains("active"))
            episode.classList.remove("active");
    });
}
export function infiniteScrollSB() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodesContainer = document.querySelector(".episodes-bar-container");
        if (episodesContainer.scrollWidth - episodesContainer.clientWidth < episodesContainer.scrollLeft + 2) {
            if (sessionStorage.getItem("endScroll") === "false") {
                sessionStorage.setItem("endScroll", "true");
                let actualPage = sessionStorage.getItem("page");
                if (actualPage === null)
                    return;
                let pageLoaded = parseInt(actualPage) + 1;
                if (pageLoaded === 3)
                    removeEventListenerScroll();
                const episodes = yield getEpisodes(`?page=${pageLoaded.toString()}`);
                addEpisodes(episodes.results);
            }
        }
    });
}
export function removeLocationEventListener() {
    const p2CS = document.querySelector(".character-location-origin");
    const p3CS = document.querySelector(".character-location-actual");
    if (p2CS === null)
        return;
    if (p3CS === null)
        return;
    if (p2CS.getAttribute("origin-url") !== null)
        p2CS.removeEventListener("click", locationClicked);
    if (p3CS.getAttribute("location-url") !== null)
        p3CS.removeEventListener("click", locationClicked);
}
function removeEventListenerScroll() {
    const episodesContainer = document.querySelector(".episodes-bar-container");
    if (episodesContainer === null)
        return;
    episodesContainer.removeEventListener("scroll", infiniteScrollSB);
}
export function removeEventListenersCardsEpisodes() {
    const cardsEpisodesContainers = document.querySelectorAll(".episode-card-character-selected");
    cardsEpisodesContainers.forEach(cardEpisode => cardEpisode.removeEventListener("click", episodeClicked));
}
export function removeCardCharacterContainerEventListener() {
    const cardCharacterContainer = document.querySelectorAll(".card-character-container");
    cardCharacterContainer.forEach(cardCharacter => cardCharacter.removeEventListener("click", characterClicked));
}
