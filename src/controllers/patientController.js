import patientService from "../services/patientService";

const postBookAppointment = async (req, res) => {
    try {
        const response = await patientService.postBookAppointmentService(
            req.body
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

const postVerifyBooking = async(req,res) => {
    try {
        const response = await patientService.postVerifyBookingService(
            req.body
        );
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!",
        });
    }
}


module.exports = {
    postBookAppointment,
    postVerifyBooking,
};
