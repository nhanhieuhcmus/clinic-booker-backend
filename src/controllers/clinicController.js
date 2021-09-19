import clinicService from '../services/clinicService';

const createNewClinic = async(req,res) => {
    try {
        const response = await clinicService.createNewClinicService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getAllClinics = async(req,res) => {
    try {
        const response = await clinicService.getAllClinicsService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getDetailClinicById = async(req, res) => {
    try {
        const response = await clinicService.getDetailClinicByIdService(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const editClinic = async(req,res) => {
    try {
        const response = await clinicService.editClinicService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const deleteClinic = async(req,res) => {
    try {
        const response = await clinicService.deleteClinicService(req.query.id);
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
    createNewClinic,
    getAllClinics,
    getDetailClinicById,
    editClinic,
    deleteClinic,
}
