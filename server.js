import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

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
        res.end(JSON.stringify(result.data));
    } catch (error) {
        res.status(500).send("Error al cargar las categorias", error)
    }
});

app.get("/top_rated/:type", async (req, res) => {
    try {
        let result = await instance_api.get(`${req.params.type}/top_rated?language=en-US&page=1`);
        res.end(JSON.stringify(result.data));
    } catch (error) {
        res.status(500).send("Error al cargar el contenido", error)
    }
});

app.post("/favorites", async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {

    }
});

app.listen(process.env.PORT, () => {
    console.log("Server started on http://localhost:3000");
})