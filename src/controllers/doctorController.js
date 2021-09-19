import doctorService from "../services/doctorService";

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }

    try {
        const response = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const response = await doctorService.getAllDoctorsService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
        });
    }
};

const postInfoDoctor = async (req, res) => {
    try {
        const response = await doctorService.postInfoDoctorService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
        });
    }
};

const getDetailDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getDetailDoctorByIdService(
            req.query.id
        );
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
        });
    }
};

const bulkCreateSchedule = async(req,res) => {
    try {
        const response = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

const getScheduleByDate = async(req,res) => {
    try {
        const response = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getExtraInfoDoctorById = async(req,res) => {
    try {
        const response = await doctorService.getExtraInfoDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getProfileDoctorById = async(req,res) => {
    try {
        const response  = await doctorService.getProfileDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const getAllPatientByDate = async(req,res) => {
    try {
        const response  = await doctorService.getAllPatientByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

const sendPrescription = async(req,res) => {
    try {
        const response  = await doctorService.sendPrescriptionService(req.body);
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
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getAllPatientByDate,
    sendPrescription,
};
