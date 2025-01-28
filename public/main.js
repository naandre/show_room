
import { getGenres, getTopRated, genresNames, saveFavorites } from "./api.js";

const IMAGE_PREFIX_URL = 'https://image.tmdb.org/t/p/w220_and_h330_face/';
const genresMovies = await getGenres("movie");
const genresTV = await getGenres("tv");

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
        <i class="fa-solid fa-clapperboard"></i>
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
        let strGenresNames = genresNames(element.genre_ids, type).join(", ");
        let card = `
        <div class="card" id="${type}_${element.id}">
            <div class="img-show" onclick="saveFavorites(${element.id}, '${type}')">
                <img src="${IMAGE_PREFIX_URL}${element.backdrop_path}" alt="${element.title || element.name}"/>
                <i class="fa-regular fa-heart"></i>
            </div>
            <span class="date-release">${element.release_date || element.first_air_date}</span>
            <h5 class="card-genres" title="${strGenresNames}">${strGenresNames}</h5>
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
                        target="_blank"><i class="fa fa-twitter icon"
                            aria-hidden="true"></i></a>
                    <a href="https://www.google.com/" class="btn btn-circle"
                        target="_blank"><i class="fa fa-google-plus icon"
                            aria-hidden="true"></i></a>
                    <span class="btn btn-circle"><i
                            class="fa-solid fa-xmark icon"></i></span>
                    <i class="fa-solid fa-share-nodes icon"></i>
                </label>
            </div>
    `;
}






loadHead();
loadFooter();
drawTopRateds('movie');
drawTopRateds('tv');