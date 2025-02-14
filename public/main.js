
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
            <div id="counterFav" class="counter"></div>
        </div>
        <div id="login"><i class="fa-solid fa-user"></i></div>
    </div>
    <div class="search__container">
        <input class="search__input" id="txtSearch" type="text" placeholder="Search">
    </div>
    `;
    document.getElementById("home").addEventListener("click", () => {
        window.location = "index.html";
    });
    document.getElementById("txtSearch").addEventListener("keyup", () => drawSearch());
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
    let isIndex = window.location.pathname.includes("index") || window.location.pathname === "/";
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
    if (favorites) {
        const divFavorite = document.getElementById("counterFav");
        divFavorite.innerText = favorites.length;
        if (isIndex)
            favorites.forEach(favElement => {
                changeStyleFav(favElement, "fa-regular", "fa-solid");
            });
    }

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
    let entertainmentVideos = await getEntertainmentVideosByIdType(id, type);
    let videos = entertainmentVideos.results.filter(x => x.site == "YouTube")
    let randomIndex = Math.floor(Math.random() * videos.length ?? 0);
    let randomVideo = videos && videos.length > 0 ? videos[randomIndex] : undefined;
    let htmlDetails = `
    <div class="img-entertainment">
        <img src="${IMAGE_PREFIX_URL}${entertainmentItem.backdrop_path}" alt="${entertainmentItem.title || entertainmentItem.name}"/>
    </div>
    <div class="detail">
        <h3>${entertainmentItem.title || entertainmentItem.name}</h3>
        <span "date-release">${entertainmentItem.release_date || entertainmentItem.first_air_date}</span>
        <h5 class="card-genres" title="${strgenresNames}">${strgenresNames}</h5>
        <span>${entertainmentItem.overview}</span>`;
    if (randomVideo) {
        htmlDetails += `
        <div class="video-container">
            <iframe id="video" width="350" height="250" 
            src="https://www.youtube.com/embed/${randomVideo.key}?autoplay=1&cc_load_policy=1&controls=0&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allow="autoplay"></iframe>
        </div>`
    }
    htmlDetails += `    
    </div>
    `
    main.innerHTML = htmlDetails;
}


var saveUser = async (event) => {
    event.preventDefault();
    try {
        const form = document.getElementById("register-form");
        const formData = new FormData(form);
        let results = await registerUser(formData);
        if (results) {
            notifyMessage("Register made Sucessfully", "SUCESS");
            form.reset();
            document.getElementById("prev_profile_img").src = "";
        }
    } catch (error) {
        let objMessage = JSON.parse(error.message);
        notifyMessage(objMessage.error, 'ERROR');
    }


}

var notifyMessage = (message, level = 'ERROR' | 'SUCESS') => {
    let divNotification = document.getElementById("div_notification");
    if (!divNotification) {
        let tmpDivNotification = document.createElement("div");
        tmpDivNotification.id = "div_notification";
        document.getElementsByTagName("body")[0].appendChild(tmpDivNotification);
        divNotification = document.getElementById("div_notification");
    }
    let iconMessage = level == "ERROR" ? '<i class="fa-solid fa-circle-exclamation"></i>' : '<i class="fa-solid fa-check"></i>';
    divNotification.className = "notification";
    divNotification.innerHTML = `
    <div class="notification-container ${level.toLocaleLowerCase()}">
        <div class="btn-close" id="close-notification">
            <i class="fa-regular fa-rectangle-xmark"></i>
        </div>
        <div class="notification-message">
            ${iconMessage}
            <p>${message}</p>
        </div>
    </div>`;
    const btnClose = document.getElementById("close-notification");
    btnClose.onclick = closeNotification;
}

var closeNotification = () => {
    let divNotification = document.getElementById("div_notification");
    divNotification.classList.toggle("hide");
}

var getPhoto = () => {
    document.getElementById("profile_image").click();
}
var getFileName = () => {
    document.getElementById("prev_profile_img").src = window.URL.createObjectURL(document.getElementById("profile_image").files[0]);
}

const loadLogin = () => {
    const containerLogin = document.getElementById("login");
    const divLogin = document.createElement("div");
    divLogin.id = "divLogin";
    divLogin.className = "popUpLogin";
    divLogin.innerHTML = `
    <h4>Login</h4>
    <form id="frm-login" method="POST">
        <div class="field-form">
            <label for="userName">User</label>
            <input type="text" id="userName" name="userName" required/>
        </div>
        <div class="field-form">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required/>
        </div>
        <button type="submit" id="btn-login">Sign In</button>
    </form>
    <a href="#">Forgot password?</a>
    <p>New to Show Room <a href="register.html">Register</a></p>
    `;
    containerLogin.appendChild(divLogin);
    document.getElementById("frm-login").addEventListener("submit", (e) => loginSubmit(e));
}

const loadProfile = () => {
    const containerLogin = document.getElementById("login");
    const divProfile = document.createElement("div");
    divProfile.id = "divProfile";
    divProfile.className = "popUpLogin";
    divProfile.innerHTML = `
    <ul>
        <li>Profile</li>
        <li>
            <div class="close_session" id="logout">
                <i class="fa-solid fa-door-open"></i>
                <span>Logout</span>
            </div>
        </li>
    </ul>
    `;
    containerLogin.appendChild(divProfile);
    document.getElementById("logout").onclick = logoutFn;
}

const loginSubmit = async (event) => {
    event.preventDefault();
    try {
        const form = document.getElementById("frm-login");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let results = await login(data);
        if (results) {
            notifyMessage("Login Sucessfully", "SUCESS");
            form.reset();
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);

        }
    } catch (error) {
        let objMessage = JSON.parse(error.message);
        notifyMessage(objMessage.error, 'ERROR');
    }
}

const logoutFn = async () => {
    try {
        let results = await logout();
        if (results) {
            notifyMessage("Logout Sucessfully", "SUCESS");
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);

        }
    } catch (error) {
        let objMessage = JSON.parse(error.message);
        notifyMessage(objMessage.error, 'ERROR');
    }
}

const validatePaswords = () => {
    const password = document.getElementById("inputPassword");
    const confirmPassword = document.getElementById("inputConfirmPassword");
    const parentCFP = confirmPassword.parentElement;
    if (password.value === confirmPassword.value) {
        parentCFP.getElementsByClassName("error-password")[0].classList.remove("show");
        return;
    }

    parentCFP.getElementsByClassName("error-password")[0].classList.add("show");
}

window.addEventListener("load", async () => {
    const path = window.location.pathname;
    genresMovies = await getGenres("movie");
    genresTV = await getGenres("tv");
    loadHead();
    loadFooter();
    if (path === "/" || path.includes("index")) {
        await drawTopRateds('movie');
        await drawTopRateds('tv');
    }
    else if (path.includes("detail")) {
        loadDetails();
    }
    else if (path.includes("register")) {
        document.getElementById("inputPassword").addEventListener("input", () => validatePaswords());
        document.getElementById("inputConfirmPassword").addEventListener("input", () => validatePaswords());
        document.getElementById("div-photoRegister").addEventListener("click", () => getPhoto());
        document.getElementById("profile_image").addEventListener("change", () => getFileName());
        document.getElementById("register-form").addEventListener("submit", (e) => saveUser(e));
    }
    await processFavorites();
    loadLogin();
    loadProfile();
    validateAuth();

});

const validateAuth = async () => {
    let profile = await fetch("api/perfil");
    let isAuth = (await profile.json())?.id ?? undefined != undefined;
    let addFav = document.querySelectorAll(".img-show i");
    if (!isAuth) {
        if (addFav.length > 0)
            addFav.forEach(fav => {
                fav.classList.add("no_auth");
            });
        document.getElementsByClassName("favorites")[0].classList.add("no_auth");
        document.getElementById("divLogin").classList.add("no_auth");
        document.getElementById("divProfile").classList.add("no_auth");
        document.getElementById("divProfile").classList.remove("auth");

    }
    else {
        if (addFav.length > 0)
            addFav.forEach(fav => {
                fav.classList.remove("no_auth");
            });
        document.getElementsByClassName("favorites")[0].classList.remove("no_auth");
        document.getElementById("divLogin").classList.remove("no_auth");
        document.getElementById("divProfile").classList.remove("no_auth");
        document.getElementById("divProfile").classList.add("auth");
    }
}

const drawSearch = async () => {
    const txtSearch = this.event.target;
    if (this.event.keyCode === 13) {
        let searchResults = await search(txtSearch.value);
        if ((searchResults?.results?.length ?? 0) == 0)
            return;
        let cant = searchResults.results.length;
        let pages = Math.ceil(cant / 5);
        let searchContainer = document.getElementById("searchContainer");
        if (!searchContainer) {
            searchContainer = document.createElement("div");
            searchContainer.id = "searchContainer";
            document.getElementsByTagName("main")[0].appendChild(searchContainer);
            searchContainer = document.getElementById("searchContainer");
        }
        let htmlItems = [];
        let inputPages = "";
        let lblPages = ""
        for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
            let indexStart = 5 * (pageNumber - 1);
            let indexEnd = pageNumber < pages ? indexStart + 5 : undefined;
            const pageResults = searchResults.results.slice(indexStart, indexEnd);
            htmlItems.push(drawPageResult(pageResults));
            inputPages = inputPages + `<input type="radio" name="input-pagination" id="pagina_${pageNumber}" ${pageNumber == 1 ? 'checked' : ''}>`
            lblPages = lblPages + `<li><label for="pagina_${pageNumber}">${pageNumber}</label></li>`;
        }
        searchContainer.innerHTML = `
        <div class="box-pagination">
            ${inputPages}
            <div class="box-pages">
                <ul>
                    ${htmlItems.join(" ")}
                </ul>
                <div class="btn-pagination">
                    <ul>
                    ${lblPages}
                    </ul>
                </div>
            </div>
        </div>
        `;
    }
}

const drawPageResult = (elements) => {
    let htmlItemsList = [];
    elements.forEach(element => {
        let htmlItem = `
        <li class="card">${element.title || element.name}</li>
        `;
        htmlItemsList.push(htmlItem);
    });
    return `
    <div class="page">
        ${htmlItemsList.join(" ")}
    </div>
    `;
}


