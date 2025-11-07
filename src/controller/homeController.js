import express from "express";
import userService from "../service/userService";

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

    return res.status(200).json({ veirfy: true, user: req.user });
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

module.exports = {
    homePage,
    handleRegisterUser,
    handleLoginUser,
    handleGetUserToken,
    handleGetUserInfo,
    handlegetAllCode,
    handleUpdateUserInfo,
}