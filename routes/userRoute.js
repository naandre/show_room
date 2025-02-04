import express from 'express';
import UserController from "../controllers/userController.js";
// import db from '../database.js';
const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
    const userData = req.body;
    try {
        const userController = new UserController(db);
        let userExists = await userController.getUserByEmail(userData.email);
        if (userExists)
            return res.status(400).json({ error: "El usuario ya se encuentra registrado" });
        let createdUser = await userController.createUser(userData);
        if (!createdUser)
            return res.status(400).json({ error: "Error al crear el usuario" });
        return res.status(200).json(createdUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }


});
export default userRouter;