import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as dataBase from './database.js';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import { entertainmentRoute, genresRoute, userRoute, favoritesRoute, topRatedRoute } from './routes/index.js';
import { authMiddelware } from './authMiddelware.js';
global.db = dataBase;

dotenv.config();
const app = express();
const __dirname = path.resolve();
const storeSQLite = SQLiteStore(session);
app.use(cors());
app.use(express.json());
app.use(session({
    store: new storeSQLite({ db: 'sessions.db' }),
    secret: '7DO34G7JU',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 60 * 1000,
    }
}));
app.use(express.static('public'));
app.use("/genres", genresRoute);
app.use("/user", userRoute);
app.use("/entertainment", entertainmentRoute);
app.use("/top_rated", topRatedRoute);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/api/perfil', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json({});
    }
});
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});
app.use(authMiddelware);
app.use("/favorites", favoritesRoute);

app.listen(process.env.PORT, () => {
    console.log("Server started on http://localhost:3000");
})