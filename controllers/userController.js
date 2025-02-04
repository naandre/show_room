import { randomUUID, createHmac } from 'crypto';

class UserController {
    constructor(db) { }

    createUser = async (userData) => {
        const { name, lastName, email, photo, password } = userData;
        let idUser = randomUUID();
        try {
            return await db.run(`INSERT INTO User (id, name, lastName, email, photo) VALUES (?, ?, ?, ?, ?)`,
                [id, name, lastName, email, photo], async function (err) {
                    if (err) throw new Error(err.message);
                    if (this.lastID)
                        savePassword(idUser, password);
                    let userCreated = await getUserById(this.lastID);
                    return userCreated;
                }
            );
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    getUserById = async (id) => {
        const sql = "SELECT * FROM User WHERE ID = ?";
        const user = await this.db.get(sql, [id]);
        return user | undefined;
    }

    getUserByEmail = async (email) => {
        const sql = "SELECT * FROM User WHERE EMAIL = ?";
        const user = await this.db.get(sql, [email]);
        return user | undefined;
    }

    savePassword = async (idUser, password) => {
        const encryptedPassWord = createHmac('sha256', password);
        let idPassWord = randomUUID();
        let dateCreated = new Date();
        db.run(`INSERT INTO Password_User (id, user_id, password, date_created) VALUES (?, ?, ?, ?)`,
            [idPassWord, idUser, encryptedPassWord, dateCreated.toLocaleString()], function (err) {
                if (err) throw new Error(err.message);
                return this.lastID;
            }
        );
    }
}

export default UserController;