import express from 'express';
import fs from 'fs';
const favoritesRouter = express.Router();


favoritesRouter.post("/", async (req, res) => {
    try {
        let favoriteReq = req.body;
        let favorites = [];
        let response = fs.readFileSync('./data/favorites.js', 'utf-8', (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        }).toString();
        favorites = JSON.parse(response);
        favorites.push(favoriteReq);
        fs.writeFileSync("./data/favorites.js", JSON.stringify(favorites), 'utf-8', (err) => {
            if (err) {
                console.log("Error writting to file", err);
            }
            else {
                console.log("Data Written to file");
            }
        })
        res.status(200).send({
            message: 'New favorite was added to the list',
        });
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error saving favorites";
        console.log(error);
        res.status(error?.status ?? 500).send(msg);
    }
});

favoritesRouter.delete("/", async (req, res) => {
    try {
        const { id, type } = req.body;
        let favorites = [];
        let response = fs.readFileSync('./data/favorites.js', 'utf-8', (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        }).toString();

        favorites = JSON.parse(response);
        let favWithOutReq = favorites.filter(x => !(x.id === id && x.type === type));
        fs.writeFileSync("./data/favorites.js", JSON.stringify(favWithOutReq), 'utf-8', (err) => {
            if (err) {
                console.log("Error writting to file", err);
            }
            else {
                console.log("Data Written to file");
            }
        })
        res.status(200).send({
            message: 'Favorite was deleted to the list',
        });
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error deleting favorite";
        console.log(error);
        res.status(error?.status ?? 500).send(msg);
    }
});

favoritesRouter.get("/", async (req, res) => {
    try {
        let response = fs.readFileSync('./data/favorites.js', 'utf-8', (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        }).toString();
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        let msg = error?.response?.data?.status_message ?? "Error getting favorites";
        res.status(error?.status ?? 500).send(msg);
    }
});

favoritesRouter.get("/:id/:type", async (req, res) => {
    try {
        const { id, type } = req.params;
        let favorites = [];
        let response = fs.readFileSync('./data/favorites.js', 'utf-8', (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        }).toString();
        console.log(response);
        favorites = JSON.parse(response);
        let favorite = favorites.find(x => x.id == id && x.type == type);
        if (favorite)
            res.status(200).send(favorite);
        else
            res.status(204).send(false);
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error getting favorites";
        console.log(error);
        res.status(error?.status ?? 500).send(msg);
    }
});

export default favoritesRouter;