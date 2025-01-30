
// const api = require("./api");
// { getGenres, getTopRated, genresNames, saveFavorites } 
const IMAGE_PREFIX_URL = 'https://image.tmdb.org/t/p/w220_and_h330_face/';
let genresMovies;
let genresTV;

// window[saveFavorites];
const loadHead = async () => {
    const head = document.getElementById("header");
    head.innerHTML = `
    <nav>
        <ul class="menu">
            <li>
                <span>Categories</span>
                <ul class="categories subMenu">
                    <li>
                        <span>Movies</span>
                        ${drawList(genresMovies, "movies")}
                    </li>
                    <li>
                        <span>TV Shows</span>
                        ${drawList(genresTV, "tv")}
                    </li>
                </ul>
            </li>
            <li><span>Popular</span></li>
            <li><span>Blog</span></li>
        </ul>
    </nav>
    <div id="fav">
        <i class="fa-solid fa-house" id="home"></i>
        <div class="favorites">
            <i class="fa-solid fa-clapperboard"></i>
            <div id="counterFav" class="counter"><div>
        </div>
    </div>`;
    document.getElementById("home").addEventListener("click", () => {
        window.location = "index.html";
    });
}

const drawList = (list, page) => {
    const itemsList = [];
    list.forEach(element => {
        let liHtml = `
        <li>
            <a href="${page}.html?genre=${element.id}">${element.name}</a>
        </li>
        `;
        itemsList.push(liHtml);
    });
    return `
    <ul class="genre" id="${page}">
        ${itemsList.join(" ")}
    </ul>`
}



const drawTopRateds = async (type) => {
    const containerTopRateds = document.getElementById(`rated-${type}`);
    const cards = [];
    const topRatedElements = await getTopRated(type);
    topRatedElements.forEach(element => {
        let strgenresNames = genresNames(element.genre_ids, type).join(", ");
        let card = `
        <div class="card" id="${type}_${element.id}" onclick="goToDetail(${element.id}, '${type}')">
            <div class="img-show">
                <img src="${IMAGE_PREFIX_URL}${element.backdrop_path}" alt="${element.title || element.name}"/>
                <i class="fa-regular fa-bookmark" onclick="event.stopPropagation(); processFavorites(${element.id}, '${type}'); return false;"></i>
            </div>
            <span class="date-release">${element.release_date || element.first_air_date}</span>
            <h5 class="card-genres" title="${strgenresNames}">${strgenresNames}</h5>
            <h3 class="title-element">${element.title || element.name}</h3>
        </div>
        `;
        cards.push(card);
    });
    containerTopRateds.innerHTML = `
    <div class="carousel animated">
    ${cards.join(" ")}
    </div>`;
}

const goToDetail = (id, type) => {
    window.location.href = `detail.html?id=${id}&type=${type}`
}

const loadFooter = () => {
    const footer = document.getElementsByTagName("footer")[0];
    footer.innerHTML = `
    <div class="btn-multi">
        <input type="checkbox" id="multi-btn" name="multi-btn" />
                <label for="multi-btn">
                    <a href="https://www.facebook.com/" class="btn btn-circle"
                        target="_blank"><i class="fa fa-facebook icon"
                            aria-hidden="true"></i></a>
                    <a href="https://www.twitter.com/" class="btn btn-circle"
                        target="_blank"><i class="fa-brands fa-x-twitter icon"
                            aria-hidden="true"></i></a>
                    <a href="https://www.instagram.com/" class="btn btn-circle"
                        target="_blank"><i class="fa-brands fa-instagram icon"
                            aria-hidden="true"></i></a>
                    <span class="btn btn-circle"><i
                            class="fa-solid fa-xmark icon"></i></span>
                    <i class="fa-solid fa-share-nodes icon"></i>
                </label>
            </div>
    `;
}

const processFavorites = async (id = undefined, type = undefined) => {
    let isIndex = window.location.href.includes("index");
    if (id && type) {
        let favorite = await getFavoriteById(id, type);
        if (!favorite)
            await saveFavorites(id, type);
        else {
            await deleteFavorite(id, type);
            changeStyleFav(favorite, "fa-solid", "fa-regular");
        }
    }
    let favorites = await getFavorites();
    const divFavorite = document.getElementById("counterFav");
    divFavorite.innerText = favorites.length;
    if (isIndex)
        favorites.forEach(favElement => {
            changeStyleFav(favElement, "fa-regular", "fa-solid");
        });
}
const changeStyleFav = (favElement, styleOld, styleNew) => {
    const card = document.getElementById(`${favElement.type}_${favElement.id}`);
    const btnFav = card.querySelector("i");
    btnFav.classList.remove(styleOld);
    btnFav.classList.add(styleNew);
}

const loadDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    let type = urlParams.get("type");
    const main = document.getElementsByTagName("main")[0];
    let entertainmentItem = await getEntertainmentItemByIdType(id, type);
    if (!entertainmentItem)
        return;
    let strgenresNames = entertainmentItem.genres.map(genre => genre.name).join(", ");
    main.innerHTML = `
    <div class="img-entertainment">
        <img src="${IMAGE_PREFIX_URL}${entertainmentItem.backdrop_path}" alt="${entertainmentItem.title || entertainmentItem.name}"/>
    </div>
    <div class="detail">
        <h3>${entertainmentItem.title || entertainmentItem.name}</h3>
        <span "date-release">${entertainmentItem.release_date || entertainmentItem.first_air_date}</span>
        <h5 class="card-genres" title="${strgenresNames}">${strgenresNames}</h5>
        <span>${entertainmentItem.overview}</span>
        <iframe id="video" width="300" height="200" 
        src="https://www.youtube.com/embed/qEtuz1ktxeA?autoplay=1&cc_load_policy=1&controls=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay"></iframe>
    </div>
    `
    document.getElementById("video").addEventListener("mouseover", () => {
        let iframe = this.event.target;
        let url = iframe.getAttribute("src").replace("mute=0", "mute=1");
        iframe.setAttribute("src", url);
    });
    document.getElementById("video").addEventListener("mouseleave", () => {
        let iframe = this.event.target;
        let url = iframe.getAttribute("src").replace("mute=1", "mute=0");
        iframe.setAttribute("src", url);
    });
}

window.addEventListener("load", async () => {
    const url = window.location.href;
    genresMovies = await getGenres("movie");
    genresTV = await getGenres("tv");
    loadHead();
    loadFooter();
    if (url.includes("index")) {
        await drawTopRateds('movie');
        await drawTopRateds('tv');
    }
    else if (url.includes("detail")) {
        loadDetails();
    }
    await processFavorites();


});







