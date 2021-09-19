import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.role,
            });
            resolve("create new user successful");
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

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const getOneUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                });
            }
            const user = await db.User.findOne({
                where: { id: data.id },
            });
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            await user.save();
            const allUsers = await db.User.findAll({
                raw: true,
            });
            resolve(allUsers);
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            await user.destroy();
            const allUsers = await db.User.findAll();
            resolve(allUsers);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser,
    hashUserPassword,
    getAllUsers,
    updateUser,
    getOneUser,
    deleteUser,
};
