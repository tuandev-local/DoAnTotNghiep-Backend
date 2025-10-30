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
    // let roleId = req.body.roleId;
    if (!email || !password || !firstName || !lastName || !phonenumber) {
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

let handleGetUserToken = async (req, res) => {

    res.status(200).json({ message: 'Profile accessed', user: req.user });
}

module.exports = {
    homePage,
    handleRegisterUser,
    handleLoginUser,
    handleGetUserToken
}