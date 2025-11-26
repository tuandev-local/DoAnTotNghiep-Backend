import express from "express";
import path from "path";
import userService from "../service/userService";
import documentService from "../service/documentService";
let homePage = (req, res) => {
    return res.send("Hello world");
}

let handleRegisterUser = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phonenumber = req.body.phonenumber;
    let roleId = req.body.role;
    if (!email || !password || !firstName || !lastName || !phonenumber || !roleId) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameter!'
        })
    }
    let message = await userService.registerUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleLoginUser = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameter!'
        })
    }

    let message = await userService.loginUser(email, password);
    console.log(message);
    return res.status(200).json(message);
}

let handleGetUserToken = (req, res) => {

    return res.status(200).json({ verify: true, user: req.user });
}

let handleAdminRoute = (req, res) => {
    if (req.user.roleId !== "R1") {
        return res.status(403).json({
            verify: false,
            message: "Access denied: admin role required"
        })
    }
    else {
        return res.status(200).json({
            verify: true,
            message: 'Admin panel accessed'
        })
    }
}

let handleGetUserInfo = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameter!'
        })
    }
    else {
        let message = await userService.getUserInfo(id);
        console.log(message);
        return res.status(200).json(message);
    }
}

let handleUpdateUserInfo = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserInfo(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    try {
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }

}

let handlegetAllCode = async (req, res) => {
    try {

        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);

    } catch (error) {
        console.log('get all code err: ', error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleUploadDocuments = async (req, res) => {
    let file = req.file;
    console.log('check req file: ', file);
    if (file) {
        let { title, description, facultyId, majorId, userId } = req.body;
        let fileName = file.originalname;
        let filePath = file.path;
        let fileType = file.mimetype;
        let data = { title, description, facultyId, majorId, userId, fileName, filePath, fileType };
        if (!title || !description || !facultyId || !majorId || !userId) {
            return res.status(500).json({
                errCode: 2,
                errMessage: 'Missing input parameter!'
            })
        }

        try {
            let message = await documentService.createDocument(data);
            console.log(message)
            return res.status(200).json(message)
        } catch (error) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            })
        }
    }
    else {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing a File!'
        })
    }


}

let handleGetFaculty = async (req, res) => {
    try {
        let message = await documentService.getFaculty();
        return res.status(200).json(message);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server....'
        })
    }

}

let handleGetMajor = async (req, res) => {
    try {
        let message = await documentService.getMajor();
        return res.status(200).json(message);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server....'
        })
    }

}

let getDocumentPagination = async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 4;
    let offset = (page - 1) * limit || 0;
    try {

        let response = await documentService.getDocumentPaginationService(+page, +limit, +offset);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server....'
        })
    }
}

let getDetailDocument = async (req, res) => {
    try {
        let info = await documentService.getDetailDocumentService(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleDownloadDocument = async (req, res) => {
    try {
        let info = await documentService.getDownloadDocument(req.query.id);
        const filePath = path.join(__dirname, "../public/uploads", info.doc);
        return res.download(filePath, info.doc);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleAddFavourDocument = async (req, res) => {
    try {
        let { userId, documentId } = req.body;
        if (!userId || !documentId) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Missing userId or documentId!'
            })
        }
        else {
            let info = await documentService.addFavourDocument(req.body);
            return res.status(200).json(info);
        }

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleGetFavourDocument = async (req, res) => {
    try {
        let info = await documentService.getFavourDocument(req.query.userId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let hadndleApprovedDocument = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing id!'
            })
        }
        else {
            let info = await documentService.putApproveDocument(id);
            return res.status(200).json(info);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let hadndleRejectDocument = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing id!'
            })
        }
        else {
            let info = await documentService.putRejectDocument(id);
            return res.status(200).json(info);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleGetPendingDocument = async (req, res) => {
    try {
        let info = await documentService.getPendingDocumentList();
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleGetDocumentByFaculty = async (req, res) => {
    try {
        let facultyId = req.query.facultyId;
        let info = await documentService.getDocumentByFaculty(facultyId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

let handleGetDocumentByMajor = async (req, res) => {
    try {
        let majorId = req.query.majorId;
        let info = await documentService.getDocumentByMajor(majorId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server!...'
        })
    }
}

module.exports = {
    homePage,
    handleRegisterUser,
    handleLoginUser,
    handleGetUserToken,
    handleAdminRoute,
    handleGetUserInfo,
    handleDeleteUser,
    handlegetAllCode,
    handleUpdateUserInfo,
    handleUploadDocuments,
    handleGetFaculty,
    handleGetMajor,
    getDocumentPagination,
    getDetailDocument,
    handleDownloadDocument,
    handleAddFavourDocument,
    handleGetFavourDocument,
    hadndleApprovedDocument,
    hadndleRejectDocument,
    handleGetPendingDocument,
    handleGetDocumentByFaculty,
    handleGetDocumentByMajor
}