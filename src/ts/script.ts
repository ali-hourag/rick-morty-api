import { setHeader, setEpisodes, addEpisodes } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
import { Episodes } from "./interface.js";

window.addEventListener("load", pageLoaded);

async function pageLoaded(): Promise<void> {
    sessionStorage.clear();
    setHeader();
    const episodes: Episodes = await getEpisodes();
    setEpisodes();
    addEpisodes(episodes.results);

    const episodesContainer: HTMLElement | null = document.querySelector(".episodes-bar-container");
    episodesContainer?.addEventListener("scroll", onScroll);
}

async function onScroll() {
    const episodesContainer: HTMLElement | null = document.querySelector(".episodes-bar-container");
    if (episodesContainer === null) return;

    //scrollWidth: actual width of the content
    //clientWidth: actual width of the part of the container that can be seen
    //scrollLeft: width of the part of the content that has been scrolled
    //if the scroll reaches the end, then scrollWidth = clientWidth + scrollLeft
    //offseetWidth is not being used since there is no border or padding.

    if (episodesContainer?.scrollWidth - episodesContainer?.clientWidth < episodesContainer?.scrollLeft + 2) {
        //The endScroll item controlls that this change is not done constantly if the user is scrolling too fast.
        //End scroll is put on false when all the data is fetched and showed. When the data is being fetched or
        //showed, then endScroll is put on true and it won't enter this function, and hence, not make changes.
        //It is on true as well when all the episodes have been loaded.

        if (sessionStorage.getItem("endScroll") === null || sessionStorage.getItem("endScroll") === "false") {
            sessionStorage.setItem("endScroll", "true");
            let actualPage: string | null = sessionStorage.getItem("page");
            if (actualPage === null) return;
            const episodes: Episodes = await getEpisodes(`?page=${(parseInt(actualPage) + 1).toString()}`);
            addEpisodes(episodes.results);
        }
    }
}