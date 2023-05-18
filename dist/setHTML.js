export function setHeader() {
    const body = document.querySelector("body");
    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const divContainer = document.createElement("div");
    const divBreadcrumb = document.createElement("div");
    const ol = document.createElement("ol");
    const h1 = document.createElement("h1");
    const emptyDiv = document.createElement("div");
    for (let i = 0; i < 3; i++) {
        const li = document.createElement("li");
        li.classList.add("breadcrumb-item");
        if (i === 0) {
            li.classList.add("active");
            li.innerText = "EPISODES";
        }
        else if (i === 1)
            li.innerText = "CHARACTERS";
        else
            li.innerText = "LOCATIONS";
        li.setAttribute("aria-current", "page");
        ol.appendChild(li);
    }
    body.setAttribute("class", "vw-100 vh-100 d-flex flex-column");
    header.classList.add("header");
    nav.setAttribute("class", "navbar navbar-dark h-100");
    nav.setAttribute("aria-label", "Navbar with information");
    divContainer.classList.add("container-fluid");
    divBreadcrumb.classList.add("breadcrumbContainer_ol");
    divBreadcrumb.setAttribute("aria-label", "breadcrumb");
    ol.setAttribute("class", "breadcrumb bg-transparent");
    h1.setAttribute("class", "seriesTitle_h1-styles text-center");
    let insertedHTML = `RICK<span class="titleSpan--small-font">and</span>MORTY`;
    h1.insertAdjacentHTML("afterbegin", insertedHTML);
    emptyDiv.classList.add("empty-div");
    header.appendChild(nav);
    nav.appendChild(divContainer);
    divContainer.appendChild(divBreadcrumb);
    divBreadcrumb.appendChild(ol);
    divContainer.appendChild(h1);
    divContainer.appendChild(emptyDiv);
    body.insertAdjacentElement("afterbegin", header);
    setEpisodes();
}
function setEpisodes() {
    const header = document.querySelector("header");
    const main = document.createElement("main");
    const episodesSection = document.createElement("section");
    const aEpisodes = document.createElement("a");
    const pEpisodes = document.createElement("p");
    const divEpisodes = document.createElement("div");
    main.setAttribute("class", "main mainContainer_main-styles d-flex flex-column");
    main.appendChild(episodesSection);
    episodesSection.setAttribute("class", "episodes-sidebar d-flex flex-row");
    episodesSection.appendChild(aEpisodes);
    episodesSection.appendChild(divEpisodes);
    aEpisodes.setAttribute("class", "text-center p-3 text-decoration-none border-bottom d-flex");
    aEpisodes.appendChild(pEpisodes);
    pEpisodes.setAttribute("class", "title-episodes align-self-center");
    pEpisodes.innerText = "EPISODES";
    divEpisodes.setAttribute("class", "episodes-bar-container d-flex flex-row overflow-auto list-group list-group-flush border-bottom scrollarea");
    header.insertAdjacentElement("afterend", main);
    setMainContainer();
}
function setMainContainer() {
    const main = document.querySelector(".main");
    const mainContainer = document.createElement("div");
    const episodeSection = document.createElement("section");
    const divTitleES = document.createElement("div");
    const titleH3ES = document.createElement("h3");
    const pInfoES = document.createElement("p");
    const divContentES = document.createElement("div");
    const characterSection = document.createElement("section");
    const characterCardContainerDivCS = document.createElement("div");
    const characterCardDivCS = document.createElement("div");
    const charImgCS = document.createElement("img");
    const cardBodyDivCS = document.createElement("div");
    const titleH4CS = document.createElement("h4");
    const p1CS = document.createElement("p");
    const p2CS = document.createElement("p");
    const p3CS = document.createElement("p");
    const divEpisodesCS = document.createElement("div");
    mainContainer.setAttribute("class", "container overflow-auto mt-5 mb-5 p-3");
    episodeSection.classList.add("episode-info");
    divTitleES.setAttribute("class", "row");
    titleH3ES.setAttribute("class", "col-12 h3-episode p-3 pl-5 text-center");
    pInfoES.setAttribute("class", "col-12 p-info-episode p-3 text-center");
    divContentES.setAttribute("class", "row characters-container row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 p-3");
    characterSection.classList.add("character-info");
    characterCardContainerDivCS.setAttribute("class", "character-card-container");
    characterCardDivCS.setAttribute("class", "card card-character-selected d-flex flex-row mb-5");
    charImgCS.setAttribute("class", "card-img-top img-character-selected");
    charImgCS.setAttribute("alt", "Card image cap");
    cardBodyDivCS.setAttribute("class", "card-body text-center");
    titleH4CS.setAttribute("class", "title-card h4-title-card text-truncate");
    p1CS.setAttribute("class", "card-text character-selected-state");
    p2CS.setAttribute("class", "character-location-origin");
    p3CS.setAttribute("class", "character-location-actual");
    divEpisodesCS.setAttribute("class", "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 episodes-container");
    episodeSection.appendChild(divTitleES);
    main.appendChild(mainContainer);
    divTitleES.appendChild(titleH3ES);
    divTitleES.appendChild(pInfoES);
    episodeSection.appendChild(divContentES);
    characterSection.appendChild(characterCardContainerDivCS);
    characterCardContainerDivCS.appendChild(characterCardDivCS);
    characterCardDivCS.appendChild(charImgCS);
    characterCardDivCS.appendChild(cardBodyDivCS);
    cardBodyDivCS.appendChild(titleH4CS);
    cardBodyDivCS.appendChild(p1CS);
    cardBodyDivCS.appendChild(p2CS);
    cardBodyDivCS.appendChild(p3CS);
    characterSection.appendChild(divEpisodesCS);
    mainContainer.appendChild(episodeSection);
    mainContainer.appendChild(characterSection);
}
