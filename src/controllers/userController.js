import userService from "../services/userService";

const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input parameter",
        });
    }

    const userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

const handleGetAllUsers = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: "Missing ID parameter",
            users: [],
        });
    }
    const users = await userService.getAllUsers(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        message: "OK",
        users,
    });
};

const handleCreateNewUser = async (req, res) => {
    const message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
    const data = req.body;
    const message = await userService.updateUser(data);
    return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id parameter!",
        });
    }
    const message = await userService.deleteUser(id);
    return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log("Get allcode error: ", error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
        });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
};
