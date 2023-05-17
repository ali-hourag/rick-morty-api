var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setHeader, setEpisodes, addEpisodes } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
window.addEventListener("load", pageLoaded);
function pageLoaded() {
    return __awaiter(this, void 0, void 0, function* () {
        sessionStorage.clear();
        setHeader();
        const episodes = yield getEpisodes();
        setEpisodes();
        addEpisodes(episodes.results);
        const episodesContainer = document.querySelector(".episodes-bar-container");
        episodesContainer === null || episodesContainer === void 0 ? void 0 : episodesContainer.addEventListener("scroll", onScroll);
    });
}
function onScroll() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodesContainer = document.querySelector(".episodes-bar-container");
        if (episodesContainer === null)
            return;
        if ((episodesContainer === null || episodesContainer === void 0 ? void 0 : episodesContainer.scrollWidth) - (episodesContainer === null || episodesContainer === void 0 ? void 0 : episodesContainer.clientWidth) < (episodesContainer === null || episodesContainer === void 0 ? void 0 : episodesContainer.scrollLeft) + 2) {
            if (sessionStorage.getItem("endScroll") === null || sessionStorage.getItem("endScroll") === "false") {
                sessionStorage.setItem("endScroll", "true");
                let actualPage = sessionStorage.getItem("page");
                if (actualPage === null)
                    return;
                const episodes = yield getEpisodes(`?page=${(parseInt(actualPage) + 1).toString()}`);
                addEpisodes(episodes.results);
            }
        }
    });
}
