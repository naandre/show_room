import express from 'express';
import instance_api from '../api/config.js';
const entertainmentRouter = express.Router();


entertainmentRouter.get("/content/:id/:type", async (req, res) => {
    const { id, type } = req.params;
    try {
        let result = await instance_api.get(`${type}/${id}?language=en-US`);
        if (!result.status == 200)
            res.status(result.status).send(JSON.stringify(result))
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        console.log(error);
        let msg = error?.response?.data?.status_message ?? `Error loading ${type}`;
        res.status(error?.status ?? 500).send(msg);
    }
});

entertainmentRouter.get("/videos/:id/:type", async (req, res) => {
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

entertainmentRouter.get("/search/:keyword", async (req, res) => {
    const keyword = req.params;
    console.log("Search");
    try {
        let result = await instance_api.get(`search/multi?query=${keyword}&&include_adult=false&language=en-US&page=1`);
        if (!result.status == 200)
            res.send(result.status).send(JSON.stringify(result));
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? `Error searching content`;
        res.status(error.status).send(msg);
    }
});

export default entertainmentRouter;