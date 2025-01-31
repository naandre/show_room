import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs'
import { type } from 'os';

dotenv.config();
const app = express();
const instance_api = axios.create({
    baseURL: process.env.URL_API,
    timeout: 1000,
    headers: { 'Authorization': `Bearer ${process.env.TOKEN_AUTH}` }
});
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/genres/:genreType", async (req, res) => {
    try {
        let result = await instance_api.get(`genre/${req.params.genreType}/list?language=en`);
        if (!result.status == 200)
            res.status(result.status).send(JSON.stringify(result))
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error loading categories";
        res.status(error.status).send(msg);
    }
});

app.get("/top_rated/:type", async (req, res) => {
    try {
        let result = await instance_api.get(`${req.params.type}/top_rated?language=en-US&page=1`);
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error loading content";
        res.status(error.status).send(msg);
    }
});

app.post("/favorites", async (req, res) => {
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

app.delete("/favorites", async (req, res) => {
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

app.get("/favorites", async (req, res) => {
    try {
        let response = fs.readFileSync('./data/favorites.js', 'utf-8', (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        }).toString();
        res.status(200).send(response);
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error getting favorites";
        console.log(error);
        res.status(error?.status ?? 500).send(msg);
    }
});

app.get("/favorites/:id/:type", async (req, res) => {
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

app.get("/entertainment/:id/:type", async (req, res) => {
    const { id, type } = req.params;
    try {
        let result = await instance_api.get(`${type}/${id}?language=en-US`);
        if (!result.status == 200)
            res.status(result.status).send(JSON.stringify(result))
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? `Error loading ${type}`;
        res.status(error.status).send(msg);
    }
});

app.get("/entertainment/videos/:id/:type", async (req, res) => {
    const { id, type } = req.params;
    try {
        let result = await instance_api.get(`${type}/${id}/videos?language=en-US`);
        if (!result.status == 200)
            res.status(result.status).send(JSON.stringify(result))
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? `Error loading ${type}`;
        res.status(error.status).send(msg);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server started on http://localhost:3000");
})