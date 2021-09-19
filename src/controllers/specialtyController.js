import specialtyService from "../services/specialtyService";

const createNewSpecialty = async(req,res) => {
    try {
        const response = await specialtyService.createNewSpecialtyService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getAllSpecialties = async(req,res) => {
    try {
        const response = await specialtyService.getAllSpecialtiesService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getDetailSpecialtyById = async(req,res) => {
    try {
        const response = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const deleteSpecialty = async(req,res) => {
    try {
        const response = await specialtyService.deleteSpecialtyService(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const editSpecialty = async(req,res) => {
    try {
        const response = await specialtyService.editSpecialtyService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}


module.exports = {
    createNewSpecialty,
    getAllSpecialties,
    getDetailSpecialtyById,
    editSpecialty,
    deleteSpecialty,
}