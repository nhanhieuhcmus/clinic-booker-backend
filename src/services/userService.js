import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {};
            const isExistUser = await checkUserEmail(email);
            if (isExistUser) {
                const checkPassword = await bcrypt.compareSync(
                    password,
                    isExistUser.password
                );
                if (checkPassword) {
                    userData.errCode = 0;
                    userData.errMessage = "OK";

                    delete isExistUser.password;
                    userData.user = isExistUser;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Wrong password!";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "The email is not exist!";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                // attributes: get only some specific fields
                attributes: ["id", "email", "firstName", "password", "roleId"],
                where: {
                    email: userEmail,
                },
                raw: true,
            });
            if (user) {
                resolve(user);
                // resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = {};
            if (userId === "all") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            } else if (userId) {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isUserExist = await checkUserEmail(data.email);
            if (isUserExist) {
                // note the 'return' resolve below, if not using return -> use the else case for creating new user
                return resolve({
                    errCode: 1,
                    errMessage: "The use is already in use!",
                });
            }
            const hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                positionId: data.position,
                roleId: data.role,
                image: data.avatar,
            });
            resolve({
                errCode: 0,
                message: "Create new user successfully",
            });
        } catch (error) {
            reject(error);
        }
    });
};

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: false,
            });
            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: "The user is not exist!",
                });
            }
            await user.destroy();
            resolve({
                errCode: 0,
                message: "The user has been deleted",
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            const user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phonenumber = data.phonenumber;
                user.address = data.address;
                user.gender = data.gender;
                user.positionId = data.position;
                user.roleId = data.role;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: "The user has been updated",
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "The user is not exist",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: type },
                });
                console.log("check allcode: ", allcode);
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getAllCodeService,
};
