import express from 'express';
import instance_api from '../api/config.js';
const topRatedRouter = express.Router();



topRatedRouter.get("/:type", async (req, res) => {
    try {
        let result = await instance_api.get(`${req.params.type}/top_rated?language=en-US&page=1`);
        res.status(200).send(JSON.stringify(result.data));
    } catch (error) {
        let msg = error?.response?.data?.status_message ?? "Error loading content";
        res.status(error.status).send(msg);
    }
});

export default topRatedRouter;