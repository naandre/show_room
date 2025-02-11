import { randomUUID, createHmac } from 'crypto';
import sqlite3 from 'sqlite3';
import { fetchFirst, execute } from '../sql.js';

class UserController {
    db;
    constructor() {
        this.db = new sqlite3.Database("show_room.db");
    }

    createUser = async (userData) => {
        const { name, lastName, userName, email, photo, password } = userData;
        let idUser = randomUUID();
        try {
            let sql = "INSERT INTO User (id, name, lastName, userName, email, profile_image) VALUES (?, ?, ?, ?, ?, ?)";
            await execute(this.db, sql, [idUser, name, lastName, userName, email, photo]);
            await this.savePassword(idUser, password);
            let userCreated = await this.getUserById(idUser);
            return userCreated != undefined;
        } catch (error) {
            throw new Error(error);
        }
    }

    getUserById = async (id) => {
        try {
            const sql = "SELECT * FROM User WHERE ID = ?";
            const user = await fetchFirst(this.db, sql, [id]);
            return user;

        } catch (error) {
            throw new Error(error);
        }
    }

    getUserByEmailAndUserName = async (email = undefined, userName = undefined) => {
        if (!email && !userName)
            return;
        try {
            const sql = "SELECT * FROM User WHERE EMAIL = ? OR USERNAME = ?";
            const user = await fetchFirst(this.db, sql, [email, userName]);
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    savePassword = async (idUser, password) => {
        try {
            const encryptedPassWord = createHmac('sha256', password.password).digest('hex');
            let idPassWord = randomUUID();
            let dateCreated = new Date();
            let sql = "INSERT INTO Password_User (id, user_id, password, date_created) VALUES (?, ?, ?, ?)";
            await execute(this.db, sql, [idPassWord, idUser, encryptedPassWord, dateCreated.toLocaleString()]);
        } catch (error) {
            throw new Error(error);
        }
    }

    getLastPassword = async (idUser) => {
        try {
            let sql = "SELECT password FROM Password_User WHERE user_id = ? ORDER BY date_created DESC LIMIT 1"
            const lastPassword = await fetchFirst(this.db, sql, [idUser]);
            return lastPassword;
        } catch (error) {
            throw new Error(error);
        }
    }

    login = async (userName, password) => {
        const encryptedPassWord = createHmac('sha256', password).digest("hex");
        try {

            const user = await this.getUserByEmailAndUserName(undefined, userName);
            if (!user)
                return;
            const lastPassword = await this.getLastPassword(user.id);
            if (!lastPassword)
                return;
            if (encryptedPassWord === lastPassword.password) {
                let sql = "UPDATE User set last_login_date = CURRENT_TIMESTAMP WHERE id = ?";
                await fetchFirst(this.db, sql, [user.id]);
                return user;
            }
            return undefined;

        } catch (error) {
            throw new Error(error);
        }
    }
}

export default UserController;