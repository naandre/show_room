import express from 'express';
import UserController from "../controllers/userController.js";
import User from '../model/user.js';
import UserPassword from '../model/user_password.js';
// import db from '../database.js';
const userRouter = express.Router();
userRouter.post("/", async (req, res) => {
    const userData = req.body;
    let userModel = new User();
    userModel.name = userData.name;
    userModel.lastName = userData.lastName;
    userModel.userName = userData.userName;
    userModel.email = userData.email;
    userModel.password = new UserPassword();
    userModel.password.password = userData.inputPassword;
    try {
        const userController = new UserController();
        let userExists = await userController.getUserByEmailAndUserName(userData.email, userData.userName);
        if (userExists)
            return res.status(400).send({ error: "User already registered" });
        let createdUser = await userController.createUser(userData);
        if (!createdUser)
            return res.status(400).send({ error: "Error saving user data" });
        return res.status(200).send(createdUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }


});

userRouter.post("/login", async (req, res) => {
    try {
        const userController = new UserController();
        const { userName, password } = req.body;
        let login = await userController.login(userName, password);
        if (!login)
            return res.status(400).send({ error: "Fail credentials" });
        return req.status(201).send({ user: JSON.stringify(login), message: "Login Succesful" });
    } catch (error) {

    }
})
export default userRouter;