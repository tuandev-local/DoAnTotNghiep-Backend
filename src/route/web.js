import express from "express";
import homeController from "../controller/homeController";
import authenticateJWT from "../middleware/authenticateToken";
import { upload } from "../middleware/uploadMiddleware";

let router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', homeController.homePage);

    router.post('/api/register', homeController.handleRegisterUser);

    router.post('/api/login', homeController.handleLoginUser);

    // Protected route
    router.get('/api/auth', authenticateJWT, homeController.handleGetUserToken);

    router.get('/api/admin', authenticateJWT, homeController.handleAdminRoute);

    router.get('/api/get-user', authenticateJWT, homeController.handleGetUserInfo);

    router.get('/api/allcode', homeController.handlegetAllCode);

    router.put('/api/update-user', authenticateJWT, homeController.handleUpdateUserInfo);

    router.delete('/api/delete-a-user', authenticateJWT, homeController.handleDeleteUser);

    router.post('/api/upload-documents', authenticateJWT, upload, homeController.handleUploadDocuments);

    router.get('/api/get-faculty', homeController.handleGetFaculty);

    router.get('/api/get-major', homeController.handleGetMajor);

    router.get('/api/get-documents', authenticateJWT, homeController.getDocumentPagination);

    router.get('/api/get-detail-document-by-id', authenticateJWT, homeController.getDetailDocument);

    router.get('/api/download-document-by-id', homeController.handleDownloadDocument);

    router.post('/api/add-favour-document', authenticateJWT, homeController.handleAddFavourDocument);

    router.get('/api/get-favour-document', authenticateJWT, homeController.handleGetFavourDocument);

    router.put('/api/approve-document', authenticateJWT, homeController.hadndleApprovedDocument);

    router.put('/api/reject-document', authenticateJWT, homeController.hadndleRejectDocument);

    router.get('/api/get-manage-document', authenticateJWT, homeController.handleGetManageDocument);

    router.get('/api/get-document-facultyId', authenticateJWT, homeController.handleGetDocumentByFaculty);

    router.get('/api/get-document-majorId', authenticateJWT, homeController.handleGetDocumentByMajor);

    router.get('/api/search-document-by-keyword', authenticateJWT, homeController.handleGetDocumentByKeyword);

    router.get('/api/suggest-document', homeController.handleGetSuggestDocument);

    return app.use("/", router);
}


module.exports = initWebRoutes;