var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getEpisodes, getEpisode, getCharacter, getLocation } from "./fetchAPI.js";
import { removeLocationEventListener, setBreadcrumb, removeEpisodeSelected, removeCardCharacterContainerEventListener, removeEventListenersCardsEpisodes } from "./supportFunctions.js";
export function addEpisodes(result) {
    const divEpisodes = document.querySelector(".episodes-bar-container");
    const anchorClasses = "episode-link list-group-item list-group-item-action py-3 lh-tight";
    const pClass = "text-episode";
    let startIndex = result[0].id;
    let endIndex = result[result.length - 1].id;
    if (divEpisodes === null)
        return;
    for (let i = startIndex; i <= endIndex; i++) {
        const aEpisode = document.createElement("a");
        const pEpisode = document.createElement("p");
        aEpisode.setAttribute("class", anchorClasses);
        aEpisode.setAttribute("id", i.toString());
        if (i === 1)
            aEpisode.classList.add("active");
        pEpisode.setAttribute("class", pClass);
        pEpisode.setAttribute("id", i.toString());
        pEpisode.innerText = `Episode ${i}`;
        aEpisode.appendChild(pEpisode);
        divEpisodes.appendChild(aEpisode);
        aEpisode.addEventListener("click", episodeClicked);
    }
    if (sessionStorage.getItem("page") !== null) {
        if (startIndex === 21) {
            sessionStorage.setItem("page", "2");
            sessionStorage.setItem("endScroll", "false");
        }
        else if (startIndex === 41) {
            sessionStorage.setItem("page", "3");
            sessionStorage.setItem("endScroll", "true");
        }
    }
    else {
        sessionStorage.setItem("page", "1");
        sessionStorage.setItem("endScroll", "false");
        setDefaultEpisode();
    }
}
function setDefaultEpisode() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeInfo = yield getEpisode(undefined, "1");
        const episodeSection = document.querySelector(".episode-info");
        const headerEpisode = document.querySelector(".h3-episode");
        const pInfoEpisode = document.querySelector(".p-info-episode");
        if (episodeSection === null)
            return;
        if (headerEpisode === null)
            return;
        if (pInfoEpisode === null)
            return;
        headerEpisode.innerText = `EPISODE 1 -- ${episodeInfo.name}`;
        pInfoEpisode.innerText = `${episodeInfo.air_date} ---- ${episodeInfo.episode}`;
        addCharacters(episodeInfo.characters);
        episodeSection.classList.add("sections-display");
    });
}
function addCharacters(charactersURL) {
    const charactersContainer = document.querySelector(".characters-container");
    if (charactersContainer === null)
        return;
    const cardCharacterContainer = document.querySelectorAll(".card-character-container");
    if (cardCharacterContainer.length > 0) {
        removeCardCharacterContainerEventListener();
        charactersContainer.replaceChildren();
    }
    charactersURL.forEach((characterURL) => __awaiter(this, void 0, void 0, function* () {
        const character = yield getCharacter(characterURL);
        const cardContainer = document.createElement("div");
        const card = document.createElement("div");
        const cardImg = document.createElement("img");
        const cardBody = document.createElement("div");
        const titleCardH4 = document.createElement("h4");
        const infoCardP = document.createElement("p");
        cardContainer.setAttribute("class", "col p-2 card-character-container");
        card.setAttribute("class", "card");
        card.setAttribute("id", character.id.toString());
        cardImg.setAttribute("class", "card-img-top");
        cardImg.setAttribute("src", character.image);
        cardImg.setAttribute("alt", "Character card image");
        cardBody.setAttribute("class", "card-body");
        titleCardH4.setAttribute("class", "title-card");
        infoCardP.setAttribute("class", "card-text");
        cardContainer.appendChild(card);
        card.appendChild(cardImg);
        card.appendChild(cardBody);
        cardBody.appendChild(titleCardH4);
        cardBody.appendChild(infoCardP);
        charactersContainer.appendChild(cardContainer);
        titleCardH4.innerText = character.name;
        infoCardP.innerText = `${character.species} -- ${character.status}`;
        card.addEventListener("click", characterClicked);
    }));
}
export function episodeClicked() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeSection = document.querySelector(".episode-info");
        const characterSection = document.querySelector(".character-info");
        const headerEpisode = document.querySelector(".h3-episode");
        const pInfoEpisode = document.querySelector(".p-info-episode");
        const idEpisode = this.getAttribute("id");
        if (episodeSection === null)
            return;
        if (characterSection === null)
            return;
        if (headerEpisode === null)
            return;
        if (pInfoEpisode === null)
            return;
        if (idEpisode === null)
            return;
        let episodeText = (this.children[0]).textContent;
        removeEpisodeSelected();
        if (this.classList.contains("episode-card-character-selected")) {
            const episodesContainer = document.querySelector(".episodes-bar-container");
            if (episodesContainer === null)
                return;
            let indexAnchorElement = parseInt(idEpisode) - 1;
            if (parseInt(idEpisode) > 20 && sessionStorage.getItem("page") === "1") {
                const episodes = yield getEpisodes("?page=2");
                addEpisodes(episodes.results);
            }
            if (parseInt(idEpisode) > 40 && sessionStorage.getItem("page") !== "3") {
                const episodes = yield getEpisodes("?page=3");
                addEpisodes(episodes.results);
            }
            const episodesSideBar = document.querySelectorAll(".episode-link");
            episodesSideBar[indexAnchorElement].classList.add("active");
            let scrollLeft = episodesSideBar[indexAnchorElement].clientWidth * (parseInt(idEpisode) - 2);
            episodesContainer.scrollLeft = scrollLeft;
        }
        else
            (this.classList.add("active"));
        setBreadcrumb(0);
        const episodeInfo = yield getEpisode(undefined, idEpisode);
        headerEpisode.innerText = `${episodeText} -- ${episodeInfo.name}`;
        pInfoEpisode.innerText = `${episodeInfo.air_date} ---- ${episodeInfo.episode}`;
        addCharacters(episodeInfo.characters);
        if (characterSection.classList.contains("sections-display"))
            characterSection.classList.remove("sections-display");
        episodeSection.classList.add("sections-display");
    });
}
export function characterClicked() {
    return __awaiter(this, void 0, void 0, function* () {
        setBreadcrumb(1);
        const characterId = this.getAttribute("id");
        if (characterId === null)
            return;
        const character = yield getCharacter(undefined, characterId);
        const episodeSection = document.querySelector(".episode-info");
        const characterSection = document.querySelector(".character-info");
        const cardImg = document.querySelector(".img-character-selected");
        const titleH4CS = document.querySelector(".h4-title-card");
        const p1CS = document.querySelector(".character-selected-state");
        const p2CS = document.querySelector(".character-location-origin");
        const p3CS = document.querySelector(".character-location-actual");
        if (episodeSection === null)
            return;
        if (characterSection === null)
            return;
        if (cardImg === null)
            return;
        if (titleH4CS === null)
            return;
        if (p1CS === null)
            return;
        if (p2CS === null)
            return;
        if (p3CS === null)
            return;
        cardImg.setAttribute("src", character.image);
        titleH4CS.innerText = character.name;
        p1CS.innerText = `${character.species} -- ${character.status} -- ${character.gender}`;
        p2CS.innerText = character.origin.name;
        p3CS.innerText = character.location.name;
        addEpisodesCS(character.episode);
        if (p2CS.innerText !== "unknown") {
            p2CS.setAttribute("origin-url", character.origin.url);
            p2CS.addEventListener("click", locationClicked);
        }
        if (p3CS.innerText !== "unknown") {
            p3CS.setAttribute("location-url", character.location.url);
            p3CS.addEventListener("click", locationClicked);
        }
        episodeSection.classList.remove("sections-display");
        characterSection.classList.add("sections-display");
    });
}
function addEpisodesCS(episodesURL) {
    removeLocationEventListener();
    const episodesContainer = document.querySelector(".episodes-container");
    if (episodesContainer === null)
        return;
    const cardsEpisodesContainers = document.querySelectorAll(".episode-card-character-selected");
    if (cardsEpisodesContainers.length > 0) {
        removeEventListenersCardsEpisodes();
        episodesContainer.replaceChildren();
    }
    episodesURL.forEach((episodeURL) => __awaiter(this, void 0, void 0, function* () {
        const episodeCardContainerCS = document.createElement("div");
        const h2EpisodeCS = document.createElement("h2");
        const pEpisodeCS = document.createElement("p");
        const episode = yield getEpisode(episodeURL);
        episodeCardContainerCS.setAttribute("class", "col episode-card-character-selected text-center mb-5");
        episodeCardContainerCS.setAttribute("id", episode.id.toString());
        h2EpisodeCS.setAttribute("class", "text-episodes-character-selected");
        pEpisodeCS.setAttribute("class", "episode-code-character-selected");
        h2EpisodeCS.innerText = `EPISODE  ${episode.id.toString()}`;
        pEpisodeCS.innerText = episode.episode;
        episodeCardContainerCS.appendChild(h2EpisodeCS);
        episodeCardContainerCS.appendChild(pEpisodeCS);
        episodesContainer.appendChild(episodeCardContainerCS);
        episodeCardContainerCS.addEventListener("click", episodeClicked);
    }));
}
export function locationClicked() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeSection = document.querySelector(".episode-info");
        const characterSection = document.querySelector(".character-info");
        const h3Location = document.querySelector(".h3-episode");
        const pLocation = document.querySelector(".p-info-episode");
        let urlLocation;
        if (episodeSection === null)
            return;
        if (characterSection === null)
            return;
        if (h3Location === null)
            return;
        if (pLocation === null)
            return;
        if (this.getAttribute("origin-url") !== null)
            urlLocation = this.getAttribute("origin-url");
        else
            urlLocation = this.getAttribute("location-url");
        if (urlLocation === null)
            return;
        const location = yield getLocation(urlLocation);
        setBreadcrumb(2);
        h3Location.innerText = location.name;
        pLocation.innerText = `${location.type} -- ${location.dimension}`;
        addCharacters(location.residents);
        characterSection.classList.remove("sections-display");
        episodeSection.classList.add("sections-display");
    });
}
