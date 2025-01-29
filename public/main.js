
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
        <div class="card" id="${type}_${element.id}">
            <div class="img-show" onclick="processFavorites(${element.id}, '${type}'); return false;">
                <img src="${IMAGE_PREFIX_URL}${element.backdrop_path}" alt="${element.title || element.name}"/>
                <i class="fa-regular fa-bookmark"></i>
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

const initValues = async () => {
    genresMovies = await getGenres("movie");
    genresTV = await getGenres("tv");
    loadHead();
    loadFooter();
    await drawTopRateds('movie');
    await drawTopRateds('tv');
    await processFavorites();
}
initValues();







