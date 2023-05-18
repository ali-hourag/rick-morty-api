var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setHeader } from "./setHTML.js";
import { getEpisodes } from "./fetchAPI.js";
import { infiniteScrollSB, addEpisodes } from "./functions.js";
window.addEventListener("load", pageLoaded);
function pageLoaded() {
    return __awaiter(this, void 0, void 0, function* () {
        sessionStorage.clear();
        setHeader();
        const episodes = yield getEpisodes();
        addEpisodes(episodes.results);
        const episodesContainer = document.querySelector(".episodes-bar-container");
        episodesContainer.addEventListener("scroll", infiniteScrollSB);
    });
}
