import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as dataBase from './database.js';
import UserController from './controllers/userController.js';
import { entertainmentRoute, genresRoute, userRoute, favoritesRoute, topRatedRoute } from './routes/index.js';
global.db = dataBase;

dotenv.config();
const app = express();
const __dirname = path.resolve();

const userController = new UserController(db);
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use("/genres", genresRoute);
app.use("/user", userRoute);
app.use("/favorites", favoritesRoute);
app.use("/entertainment", entertainmentRoute);
app.use("/top_rated", topRatedRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});
app.listen(process.env.PORT, () => {
    console.log("Server started on http://localhost:3000");
})