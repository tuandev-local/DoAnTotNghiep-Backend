import express from "express";
import homeController from "../controller/homeController";
import authenticateJWT from "../middleware/authenticateToken";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.homePage);

    router.post('/api/register', homeController.handleRegisterUser);

    router.post('/api/login', homeController.handleLoginUser);

    // Protected route
    router.get('/api/auth', authenticateJWT, homeController.handleGetUserToken);

    router.get('/api/get-user', authenticateJWT, homeController.handleGetUserInfo);

    router.get('/api/allcode', homeController.handlegetAllCode);

    router.put('/api/update-user', authenticateJWT, homeController.handleUpdateUserInfo);


    return app.use("/", router);
}


module.exports = initWebRoutes;