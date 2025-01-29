
const getGenres = (genreType) => {
    let localStgenres = JSON.parse(localStorage.getItem(`genre_${genreType}`)) || [];
    if (localStgenres.length > 0) {
        return localStgenres;
    }
    return fetch(`genres/${genreType}`)
        .then(result => {
            return result.json()
        })
        .then(data => {
            let { genres } = data;
            localStorage[`genre_${genreType}`] = JSON.stringify(genres);
            return genres || [];
        });
}

const getTopRated = (type) => {
    let localStoTopRated = JSON.parse(localStorage.getItem(`topRated_${type}`)) || [];
    if (localStoTopRated.length > 0) {
        return localStoTopRated;
    }
    return fetch(`top_rated/${type}`)
        .then(result => {
            return result.json();
        }).then(data => {
            let { results } = data;
            localStorage[`topRated_${type}`] = JSON.stringify(results);
            return results || [];
        });
}

const genresNames = (ids, type) => {
    const genres = JSON.parse(localStorage[`genre_${type}`]);
    return genres.filter(genre => ids.includes(genre.id)).map(genre => genre.name);
}

const saveFavorites = async (id, type) => {
    try {
        let elementResume = {
            id: id,
            type: type
        }
        let savedResponse = await fetch("favorites", {
            body: JSON.stringify(elementResume),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!savedResponse.ok)
            throw new Error(`Response status: ${savedResponse.status}`);
        const json = await savedResponse.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        return "";
    }
}

const deleteFavorite = async (id, type) => {
    try {
        let elementResume = {
            id: id,
            type: type
        }
        let deletedResponse = await fetch("favorites", {
            body: JSON.stringify(elementResume),
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!savedResponse.ok)
            throw new Error(`Response status: ${savedResponse.status}`);
        const json = await savedResponse.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        return "";
    }
}

const getFavorites = async () => {
    try {
        let result = await fetch("favorites");
        if (!result.ok)
            throw new Error(`Response status: ${savedResponse.status}`);
        return await result.json();
    } catch (error) {
        console.error(error)
        return "";
    }
}

const getFavoriteById = async (id, type) => {
    try {
        let result = await fetch(`favorites/${id}/${type}`);
        if (!result.ok)
            throw new Error(`Response status: ${savedResponse.status}`);
        return result.status == 200 ? await result.json() : false;
    } catch (error) {
        console.error(error)
        return "";
    }
}