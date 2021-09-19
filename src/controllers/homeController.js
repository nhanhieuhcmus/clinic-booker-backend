import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        // let data = await db.User.findAll();
        return res.render("homepage.ejs", {
            // data: JSON.stringify(data),
            data: JSON.stringify({}),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = (req, res) => {
    res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("post crud");
};

let displayGetCRUD = async(req, res) => {
    const data = await CRUDService.getAllUsers();
    console.log(data);
    return res.render("displayCRUD.ejs", {
        dataTable: data 
    });
};

const displayEditCRUD = async(req,res) => {
    const userId = req.query.id;
    if (userId) {
        const user = await CRUDService.getOneUser(userId);
        return res.render("editCRUD.ejs", {
            userData: user,
        });
    }
    else{
        return res.send("User not found");
    }
    // return res.render("editCRUD.ejs");
}

const putCRUD = async(req,res) => {
    const data = req.body;
    const newData = await CRUDService.updateUser(data);
    return res.render("displayCRUD.ejs", {
        dataTable: newData,
    });
}

const deleteCRUD = async(req,res) => {
    const userId = req.query.id;
    const newData = await CRUDService.deleteUser(userId);
    return res.render("displayCRUD.ejs", {
        dataTable: newData,
    });
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    displayEditCRUD,
    putCRUD,
    deleteCRUD,
};
