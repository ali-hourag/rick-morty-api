import { Episodes, Episode, Character, Location } from "./interface.js";
import { getEpisodes, getEpisode, getCharacter, getLocation } from "./fetchAPI.js";

/**
 * This file has different functions that interact with the DOM 
 * that are used in this project.
 * There are EventListeners and different related functions
 */

// The order of the functions is important, so I have done it following the direction in which
// the code runs, mantaining some logic in organizing the code.
// The functions internally are organized in a logical manner as well so that
// legibility, maintenance and reusability are improved.


//------------------------------------------------------------------------------------------------------------
/**
 * This funciont adds Episodes to the sidebar.
 * @param result array of the episodes
 * Does not return anything. It shows the episodes
 * passed as parameters.
 */
export function addEpisodes(result: Episodes["results"]): void {

    const divEpisodes: (HTMLDivElement | null) = document.querySelector(".episodes-bar-container");
    const anchorClasses: string = "episode-link list-group-item list-group-item-action py-3 lh-tight";
    const pClass: string = "text-episode";
    let startIndex: number = result[0].id; //is the id of the first episode of the array.
    let endIndex: number = result[result.length - 1].id; //is the id of the last episode of the array.
    if (divEpisodes === null) return;

    //create episodes on the sidebar
    for (let i = startIndex; i <= endIndex; i++) {
        const aEpisode: (HTMLAnchorElement) = document.createElement("a");
        const pEpisode: (HTMLParagraphElement) = document.createElement("p");
        aEpisode.setAttribute("class", anchorClasses);
        aEpisode.setAttribute("id", i.toString());
        if (i === 1) aEpisode.classList.add("active");
        pEpisode.setAttribute("class", pClass);
        pEpisode.setAttribute("id", i.toString());
        pEpisode.innerText = `Episode ${i}`;
        aEpisode.appendChild(pEpisode);
        divEpisodes.appendChild(aEpisode);

        aEpisode.addEventListener("click", episodeClicked); //EventListener for the episodes
    }

    //Control where the program is so that we can take care
    //of doing everything properly
    //This items will help us know in which page we are
    //and if we can keep scrolling or we can not
    if (sessionStorage.getItem("page") !== null) {
        if (startIndex === 21) {
            sessionStorage.setItem("page", "2");
            sessionStorage.setItem("endScroll", "false");
        }
        else if (startIndex === 41) {
            sessionStorage.setItem("page", "3");
            sessionStorage.setItem("endScroll", "true");
        }
    } else {
        sessionStorage.setItem("page", "1");
        sessionStorage.setItem("endScroll", "false");
        //If we are here, then the page has just loaded and 
        //the container has to be set with the inf of the first episode
        setDefaultEpisode();
    }
}
//------------------------------------------------------------------------------------------------------------
/**
 * Doing this function to set default episode.
 * I could have forced a click to the first episode. However, it may give us
 * some problems in certain browsers.
 */
async function setDefaultEpisode(): Promise<void> {
    const episodeInfo: Episode = await getEpisode(undefined, "1");
    const episodeSection: (HTMLElement | null) = document.querySelector(".episode-info");
    const headerEpisode: (HTMLHeadingElement | null) = document.querySelector(".h3-episode");
    const pInfoEpisode: (HTMLParagraphElement | null) = document.querySelector(".p-info-episode");
    if (episodeSection === null) return;
    if (headerEpisode === null) return;
    if (pInfoEpisode === null) return;

    headerEpisode.innerText = `EPISODE 1 -- ${episodeInfo.name}`;
    pInfoEpisode.innerText = `${episodeInfo.air_date} ---- ${episodeInfo.episode}`;
    addCharacters(episodeInfo.characters);

    //Show episode section after everything has been set
    episodeSection.classList.add("sections-display");
}

//------------------------------------------------------------------------------------------------------------
/**
 * @param charactersURL Array with the URLs of a set of characters
 * does not return anything, but sets everything up in the container depending
 * on the element clicked showing the characters that appeared in a certain episode
 */
function addCharacters(charactersURL: Array<string>): void {
    const charactersContainer: (HTMLDivElement | null) = document.querySelector(".characters-container");
    if (charactersContainer === null) return;
    //Remove previous characters from another episode
    charactersContainer.replaceChildren();

    charactersURL.forEach(async (characterURL: string): Promise<void> => {
        const character: Character = await getCharacter(characterURL);

        const cardContainer: (HTMLDivElement) = document.createElement("div");
        const card: (HTMLDivElement) = document.createElement("div");
        const cardImg: (HTMLImageElement) = document.createElement("img");
        const cardBody: (HTMLDivElement) = document.createElement("div");
        const titleCardH4: (HTMLHeadingElement) = document.createElement("h4");
        const infoCardP: (HTMLParagraphElement) = document.createElement("p");

        cardContainer.setAttribute("class", "col p-2");
        card.setAttribute("class", "card");
        card.setAttribute("id", character.id.toString());
        cardImg.setAttribute("class", "card-img-top");
        cardImg.setAttribute("src", character.image);
        cardImg.setAttribute("alt", "Character card image")
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
    })

}
//------------------------------------------------------------------------------------------------------------
/**
 * EventListener of the episode when clicked on the top sidebar
 * or when displaying the character information on the main.
 * @param this object of the element clicked
 * does not reutrn anything.
 * It sets up the respective elements for the episode clicked
 */
async function episodeClicked(this: HTMLAnchorElement): Promise<void> {
    const episodeSection: (HTMLElement | null) = document.querySelector(".episode-info");
    const characterSection: (HTMLElement | null) = document.querySelector(".character-info");
    const headerEpisode: (HTMLHeadingElement | null) = document.querySelector(".h3-episode");
    const pInfoEpisode: (HTMLParagraphElement | null) = document.querySelector(".p-info-episode");
    const idEpisode: (string | null) = this.getAttribute("id");

    if (episodeSection === null) return;
    if (characterSection === null) return;
    if (headerEpisode === null) return;
    if (pInfoEpisode === null) return;
    if (idEpisode === null) return;

    //children[0] will be a paragraph or heading depending on which part the episode has
    //been clicked. If the sidebar at the top, then paragraph
    //if the main container when seeing the character information, then heading

    let episodeText: (string | null) = (this.children[0]).textContent;

    //Highligh the episode selected and move the scrollbar if needed
    removeEpisodeSelected();

    //Make active the episode of the sidebar selected

    /**
     * In this part we have to differenciate. If the function has been called from the click of an episode at
     * the top sidebar or clicked from the container when showing the character information.
     * If it is the second option, then we enter on the if conditional. Otherwise, on the else.
     */
    if (this.classList.contains("episode-card-character-selected")) {
        const episodesContainer: (HTMLElement | null) = document.querySelector(".episodes-bar-container");
        if (episodesContainer === null) return;
        let indexAnchorElement: number = parseInt(idEpisode) - 1;
        //Add ?page=2 and ?page=3 if necessary
        if (parseInt(idEpisode) > 20 && sessionStorage.getItem("page") === "1") {
            const episodes: Episodes = await getEpisodes("?page=2");
            addEpisodes(episodes.results);
        }
        if (parseInt(idEpisode) > 40 && sessionStorage.getItem("page") !== "3") {
            const episodes: Episodes = await getEpisodes("?page=3");
            addEpisodes(episodes.results);
        }
        //Has to be here, since NodeList is static and the previous conditionals may add some more anchor elements
        const episodesSideBar: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".episode-link");
        episodesSideBar[indexAnchorElement].classList.add("active");

        /**
         * After selecting an episode from the container I want the top scroll to be in the episode I 
         * have chosen and I want it to be highlighted (which has been done on the previous step).
         * To move the scrollbar I get the width of the anchor element on the top side bar and I multiply
         * it by the id of the episode selected. (-2 just to position it more centered for mobile
         * devices and on the first positions for desktop devices).
         * Then, this total width is assigned to the scrollLeft property of the container with the scrollbar
         * which will move the container to the left.
         * Without the -2 the anchor element will be last one to be hidden.
         */
        let scrollLeft: number = episodesSideBar[indexAnchorElement].clientWidth * (parseInt(idEpisode) - 2);
        episodesContainer.scrollLeft = scrollLeft;

    } else (this.classList.add("active")); //If it is clicked from the top sidebar, then just add the active class

    //Set breadcrumb
    setBreadcrumb(0);

    //Get episode clicked info from API
    const episodeInfo: Episode = await getEpisode(undefined, idEpisode);
    //Apply a title of the container
    headerEpisode.innerText = `${episodeText} -- ${episodeInfo.name}`;
    pInfoEpisode.innerText = `${episodeInfo.air_date} ---- ${episodeInfo.episode}`;

    addCharacters(episodeInfo.characters);

    //Show episodeSections after everything has been set
    if (characterSection.classList.contains("sections-display")) characterSection.classList.remove("sections-display");
    episodeSection.classList.add("sections-display");
}
//------------------------------------------------------------------------------------------------------------
/**
 * 
 * @param this div element of the character clicked
 * after clicking in a character, this function changes to the character section
 * and shows its information
 */
async function characterClicked(this: HTMLDivElement): Promise<void> {
    setBreadcrumb(1); //change breadcrumb
    const characterId: (string | null) = this.getAttribute("id");
    if (characterId === null) return;
    const character: Character = await getCharacter(undefined, characterId);
    const episodeSection: (HTMLElement | null) = document.querySelector(".episode-info");
    const characterSection: (HTMLElement | null) = document.querySelector(".character-info");
    const cardImg: (HTMLImageElement | null) = document.querySelector(".img-character-selected");
    const titleH4CS: (HTMLHeadingElement | null) = document.querySelector(".h4-title-card");
    const p1CS: (HTMLParagraphElement | null) = document.querySelector(".character-selected-state");
    const p2CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-origin");
    const p3CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-actual");

    if (episodeSection === null) return;
    if (characterSection === null) return;
    if (cardImg === null) return;
    if (titleH4CS === null) return;
    if (p1CS === null) return;
    if (p2CS === null) return;
    if (p3CS === null) return;

    cardImg.setAttribute("src", character.image); //Show image
    //Set card text with the character's information
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


    //Hide other section, and show this one after everything has been set
    episodeSection.classList.remove("sections-display");
    characterSection.classList.add("sections-display");
}
//------------------------------------------------------------------------------------------------------------
/**
 * @param episodesURL Array with the URLs of a set of episodes
 * does not return anything, but sets everything up in the container depending
 * on the element clicked showing the episodes in which the character has appeared
 */
function addEpisodesCS(episodesURL: Array<string>): void {
    //Remove two eventListeners. In the function comments I explain why is this done
    removeLocationEventListener();

    const episodesContainer: (HTMLDivElement | null) = document.querySelector(".episodes-container");
    if (episodesContainer === null) return;

    episodesContainer.replaceChildren();
    episodesURL.forEach(async (episodeURL: string): Promise<void> => {
        const episodeCardContainerCS: (HTMLDivElement) = document.createElement("div");
        const h2EpisodeCS: (HTMLHeadingElement) = document.createElement("h2");
        const pEpisodeCS: (HTMLParagraphElement) = document.createElement("p");
        const episode: Episode = await getEpisode(episodeURL);

        episodeCardContainerCS.setAttribute("class", "col episode-card-character-selected text-center mb-5");
        episodeCardContainerCS.setAttribute("id", episode.id.toString());
        h2EpisodeCS.setAttribute("class", "text-episodes-character-selected");
        pEpisodeCS.setAttribute("class", "episode-code-character-selected");

        h2EpisodeCS.innerText = `EPISODE  ${episode.id.toString()}`;
        pEpisodeCS.innerText = episode.episode;

        episodeCardContainerCS.addEventListener("click", episodeClicked);

        episodeCardContainerCS.appendChild(h2EpisodeCS);
        episodeCardContainerCS.appendChild(pEpisodeCS);

        episodesContainer.appendChild(episodeCardContainerCS);
    })

}
//------------------------------------------------------------------------------------------------------------
/**
 * 
 * @param this location clicked.
 * It can be origin or actual location.
 * It does not return anything.
 * It gives us the characters which are residents or come from that location
 */
async function locationClicked(this: HTMLParagraphElement): Promise<void> {
    //Set everything up, and create characters
    //I will reuse the episode Section since the structure is very similar
    const episodeSection: (HTMLElement | null) = document.querySelector(".episode-info");
    const characterSection: (HTMLElement | null) = document.querySelector(".character-info");
    const h3Location: (HTMLHeadingElement | null) = document.querySelector(".h3-episode");
    const pLocation: (HTMLParagraphElement | null) = document.querySelector(".p-info-episode");
    let urlLocation: string | null;
    if (episodeSection === null) return;
    if (characterSection === null) return;
    if (h3Location === null) return;
    if (pLocation === null) return;

    if (this.getAttribute("origin-url") !== null) urlLocation = this.getAttribute("origin-url");
    else urlLocation = this.getAttribute("location-url");
    if (urlLocation === null) return;

    const location: Location = await getLocation(urlLocation);
    setBreadcrumb(2);

    h3Location.innerText = location.name;
    pLocation.innerText = `${location.type} -- ${location.dimension}`;


    addCharacters(location.residents);
    //Change sections
    characterSection.classList.remove("sections-display");
    episodeSection.classList.add("sections-display");
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
function removeLocationEventListener() {
    const p2CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-origin");
    const p3CS: (HTMLParagraphElement | null) = document.querySelector(".character-location-actual");
    if (p2CS === null) return;
    if (p3CS === null) return;
    if (p2CS.getAttribute("origin-url") !== null) p2CS.removeEventListener("click", locationClicked);
    if (p3CS.getAttribute("location-url") !== null) p3CS.removeEventListener("click", locationClicked);
}
//------------------------------------------------------------------------------------------------------------
/**
 * Sets active class to the respective class in the breadcrumb indicating in which
 * part of the web we are situated
 * @param activeItem receives a number indicating where we are
 *  if activeItem === 0, then class active will be added to episodes
 * else if activeItem === 1, then class active will be added to characters
 * else if activeItem === 2, then class active will be added to locations
 */
function setBreadcrumb(activeItem: (0 | 1 | 2)): void {
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
function removeEpisodeSelected(): void {
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
            const episodes: Episodes = await getEpisodes(`?page=${(parseInt(actualPage) + 1).toString()}`);
            addEpisodes(episodes.results); //Add it to the sidebar
        }
    }
}