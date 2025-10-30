import express from "express";
import homeController from "../controller/homeController";
import authenticateJWT from "../middleware/authenticateToken";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.homePage);

    router.post('/api/register', homeController.handleRegisterUser);

    router.post('/api/login', homeController.handleLoginUser);

    // Protected route
    app.get('/api/auth', authenticateJWT, homeController.handleGetUserToken);


    return app.use("/", router);
}


module.exports = initWebRoutes;