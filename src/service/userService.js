import express from 'express';
import db from '../models/index';
import bcrypt from "bcryptjs";
import { where } from 'sequelize';
import { raw } from 'body-parser';
import jwt from 'jsonwebtoken';


require('dotenv').config({ path: './src/.env' });



const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }

    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email: userEmail } });
            if (user) {
                resolve(true);
            }
            else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }

    })
}



let registerUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exist!'
                })
            }
            else {
                let hashPasswordBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phonenumber: data.phonenumber,
                    roleId: data.role
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Register Successed!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let loginUser = (userEmail, userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userEmail);

            //check email
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: userEmail },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true,
                });
                //check user
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(userPassword, user.password);
                    const token = jwt.sign({ email: user.email, roleId: user.roleId, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: '1800s' });
                    //match password
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Login Successful!';
                        delete user.password;
                        userData.user = user;
                        userData.token = token;

                    }
                    else {

                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password.Plz try again!';

                    }
                }
                else {

                    userData.errCode = 2;
                    userData.errMessage = 'User not found!';
                    userData.user = {};
                }
            }
            else {

                userData.errCode = 1;
                userData.errMessage = `Email doesn't exist!`;

            }
            resolve(userData);

        } catch (error) {
            reject(error)
        }
    })
}

let getUserInfo = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = [];
            if (userId && userId === 'ALL') {
                userData = await db.User.findAll({

                    attributes: { exclude: ['password'] },
                    raw: true,
                });

            }

            if (userId && userId !== 'ALL') {
                userData = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] },
                    raw: true,
                });

            }

            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing id!'
                })
            }
            else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    attributes: { exclude: ['password'] },
                    raw: false,
                })
                if (user) {
                    user.email = data.email;
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.phonenumber = data.phonenumber;
                    user.roleId = data.role;
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update user successfuly!',
                        userEdit: user
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'User not found!'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (inputUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: inputUserId }
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found!'
                })
            }
            else {
                await db.User.destroy({
                    where: { id: inputUserId }
                });
                resolve({
                    errCode: 0,
                    errMessage: `User is deleted!`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.datatype = allcode;
                resolve(res);
            }


        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    getAllCodeService,
    updateUserInfo,
    deleteUser
}