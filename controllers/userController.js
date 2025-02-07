import { randomUUID, createHmac } from 'crypto';
import sqlite3 from 'sqlite3';

class UserController {
    db;
    constructor() {
        this.db = new sqlite3.Database("show_room.db");
    }

    createUser = async (userData) => {
        const { name, lastName, userName, email, photo, password } = userData;
        let idUser = randomUUID();
        try {
            console.log(db);
            return await this.db.run(`INSERT INTO User (id, name, lastName, userName, email, profile_image) VALUES (?, ?, ?, ?, ?)`,
                [idUser, name, lastName, userName, email, photo], async function (err) {
                    if (err) throw new Error(err.message);
                    if (this.lastID)
                        savePassword(idUser, password);
                    let userCreated = await getUserById(this.lastID);
                    return userCreated;
                }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    getUserById = async (id) => {
        try {
            const sql = "SELECT * FROM User WHERE ID = ?";
            const user = await this.db.get(sql, [id]);
            return user | undefined;

        } catch (error) {
            throw new Error(error);
        }
    }

    getUserByEmailAndUserName = async (email = undefined, userName = undefined) => {
        if (!email && !userName)
            return;
        try {
            const sql = "SELECT * FROM User WHERE EMAIL = ? OR USERNAME = ?";
            const user = await this.db.get(sql, [email, userName]);
            return user | undefined;
        } catch (error) {
            throw new Error(error);
        }
    }

    savePassword = async (idUser, password) => {
        const encryptedPassWord = createHmac('sha256', password);
        let idPassWord = randomUUID();
        let dateCreated = new Date();
        try {
            this.db.run(`INSERT INTO Password_User (id, user_id, password, date_created) VALUES (?, ?, ?, ?)`,
                [idPassWord, idUser, encryptedPassWord, dateCreated.toLocaleString()], function (err) {
                    if (err) throw new Error(err.message);
                    return this.lastID;
                }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    getLastPassword = async (idUser) => {
        try {
            const lastPassword = await this.db.get(`SELECT TOP 1 password FROM Password_User WHERE user_id = ? 
                ORDER BY date_created DESC`, [idUser]);
            return lastPassword | undefined;
        } catch (error) {
            throw new Error(error);
        }
    }

    login = async (userName, password) => {
        const encryptedPassWord = createHmac('sha256', password);
        try {
            const user = await this.getUserByEmailAndUserName(undefined, userName);
            if (!user)
                return;
            const lastPassword = await this.getLastPassword(user.id);
            if (!lastPassword)
                return;
            return encryptedPassWord === lastPassword ? user : undefined;

        } catch (error) {
            throw new Error(error);
        }
    }
}

export default UserController;