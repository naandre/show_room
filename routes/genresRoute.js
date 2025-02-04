import express from 'express';
import instance_api from '../api/config.js';
const genresRouter = express.Router();


genresRouter.get("/:genreType", async (req, res) => {
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

export default genresRouter;