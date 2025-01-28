
export const getGenres = (genreType) => {
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

export const getTopRated = (type) => {
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

export const genresNames = (ids, type) => {
    const genres = JSON.parse(localStorage[`genre_${type}`]);
    return genres.filter(genre => ids.includes(genre.id)).map(genre => genre.name);
}

export const saveFavorites = async (idEntertainmentObj, type) => {
    try {
        let elementResume = {
            id: idEntertainmentObj,
            type: type
        }
        let savedResponse = await fetch("favorites", {
            body: JSON.stringify(entertainmentObject),
            method: "POST"
        });
        if (!savedResponse.ok)
            throw new Error(`Response status: ${savedResponse.status}`);
        const json = await savedResponse.json();
        return json;
    } catch (error) {
        console.error(error.message);
        return "";
    }


}