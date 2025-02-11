import UserController from "./controllers/userController.js";

export const authMiddelware = async (req, res, next) => {
    const userController = new UserController();
    try {
        let user = await userController.getUserById(req.session?.user?.id ?? "");
        if (!user) {
            const err = new Error();
            err.status = 400;
            err.message = "Not authorized! Go back!";
            return next(err); // This will be caught by error handler
        } else {
            return next(); // No error proceed to next middleware
        }

    } catch (error) {
        return next(error);
    }

};