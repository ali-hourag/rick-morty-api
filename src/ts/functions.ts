import { Episodes, Episode, Character } from "./interface.js";
import { getEpisodes, getEpisode, getCharacter } from "./fetchAPI.js";

/**
 * This file has different functions that interact with the DOM 
 * that are used in this project.
 * There are EventListeners and different related functions
 */
//------------------------------------------------------------------------------------------------------------
/**
 * This funciont adds Episodes to the sidebar.
 * @param result array of the episodes
 * Does not return anything. It shows the episodes
 * passed as parameters.
 */
export function addEpisodes(result: Episodes["results"]): void {

    const divEpisodes = document.querySelector(".episodes-bar-container") as HTMLDivElement;
    const anchorClasses: string = "episode-link list-group-item list-group-item-action py-3 lh-tight";
    const pClass: string = "text-episode";
    let startIndex: number = result[0].id; //is the id of the first episode of the array.
    let endIndex: number = result[result.length - 1].id; //is the id of the last episode of the array.

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
    const episodeSection = document.querySelector(".episode-info") as HTMLElement;
    const headerEpisode = document.querySelector(".h3-episode") as HTMLHeadingElement;
    const pInfoEpisode = document.querySelector(".p-info-episode") as HTMLParagraphElement;


    headerEpisode.innerText = `EPISODE 1 -- ${episodeInfo.name}`;
    pInfoEpisode.innerText = `${episodeInfo.air_date} ---- ${episodeInfo.episode}`;
    addCharacters(episodeInfo.characters);

    //Show episode section after everything has been set
    episodeSection.classList.add("sections-display");
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
    const episodeSection = document.querySelector(".episode-info") as HTMLElement;
    const characterSection = document.querySelector(".character-info") as HTMLElement;
    const headerEpisode = document.querySelector(".h3-episode") as HTMLHeadingElement;
    const pInfoEpisode = document.querySelector(".p-info-episode") as HTMLParagraphElement;
    const idEpisode = this.getAttribute("id") as string;

    //children[0] will be a paragraph or heading depending on which part the episode has
    //been clicked. If the sidebar at the top, then paragraph
    //if the main container when seeing the character information, then heading
    let episodeText: string = (this.children[0] as HTMLParagraphElement | HTMLHeadingElement).innerText;

    //Highligh the episode selected and move the scrollbar if needed
    removeEpisodeSelected();

    //Make active the episode of the sidebar selected

    /**
     * In this part we have to differenciate. If the function has been called from the click of an episode at
     * the top sidebar or clicked from the container when showing the character information.
     * If it is the second option, then we enter on the if conditional. Otherwise, on the else.
     */
    if (this.classList.contains("episode-card-character-selected")) {
        const episodesContainer = document.querySelector(".episodes-bar-container") as HTMLElement;
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
 * @param charactersURL Array with the URLs of a set of characters
 * does not return anything, but sets everything up in the container depending
 * on the element clicked showing the characters that appeared in a certain episode
 */
function addCharacters(charactersURL: Array<string>): void {
    const charactersContainer = document.querySelector(".characters-container") as HTMLDivElement;
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
 * 
 * @param this div element of the character clicked
 * after clicking in a character, this function changes to the character section
 * and shows its information
 */
async function characterClicked(this: HTMLDivElement): Promise<void> {
    setBreadcrumb(1); //change breadcrumb
    const characterId = this.getAttribute("id") as string;
    const character: Character = await getCharacter(undefined, characterId);
    const episodeSection = document.querySelector(".episode-info") as HTMLElement;
    const characterSection = document.querySelector(".character-info") as HTMLElement;
    const cardImg = document.querySelector(".img-character-selected") as HTMLImageElement;
    const titleH4CS = document.querySelector(".h4-title-card") as HTMLHeadingElement;
    const p1CS = document.querySelector(".character-selected-state") as HTMLParagraphElement;
    const p2CS = document.querySelector(".character-location-origin") as HTMLParagraphElement;
    const p3CS = document.querySelector(".character-location-actual") as HTMLParagraphElement;

    cardImg.setAttribute("src", character.image); //Show image
    //Set card text with the character's information
    titleH4CS.innerText = character.name;
    p1CS.innerText = `${character.species} -- ${character.status} -- ${character.gender}`;
    p2CS.innerText = character.origin.name;
    p3CS.innerText = character.location.name;


    addEpisodesCS(character.episode);

    if (p2CS.innerText !== "unknown") {
        p2CS.setAttribute("origin", character.origin.url);
        p2CS.addEventListener("click", locationClicked);
    }
    p3CS.setAttribute("location", character.location.url);
    p3CS.addEventListener("click", locationClicked);

    //Hide other section, and show this one after everything has been set
    episodeSection.classList.remove("sections-display");
    characterSection.classList.add("sections-display");

}
//------------------------------------------------------------------------------------------------------------
/**
 * 
 */
async function locationClicked(this: HTMLParagraphElement): Promise<void> {
    //Set everything up, and create characters


    //Change sections

}
//------------------------------------------------------------------------------------------------------------
/**
 * @param episodesURL Array with the URLs of a set of episodes
 * does not return anything, but sets everything up in the container depending
 * on the element clicked showing the episodes in which the character has appeared
 */
function addEpisodesCS(episodesURL: Array<string>): void {
    const episodesContainer = document.querySelector(".episodes-container") as HTMLDivElement;
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
            let actualPage = sessionStorage.getItem("page") as string;
            //Fetch of the respective page of the API
            const episodes: Episodes = await getEpisodes(`?page=${(parseInt(actualPage) + 1).toString()}`);
            addEpisodes(episodes.results); //Add it to the sidebar

        }
    }
}