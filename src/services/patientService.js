import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

const generateVerifyLink = (doctorId, token) => {
    return `${process.env.REACT_URL}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

const postBookAppointmentService = (inputData) => {
    /**
     * Create an patient email account (users)
     * Create an appointment (bookings)
     */
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.email ||
                !inputData.doctorId ||
                !inputData.timeType ||
                !inputData.date ||
                !inputData.fullName ||
                !inputData.selectedGender ||
                !inputData.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const token = uuidv4();

                // verify patient email
                await emailService.sendConfirmEmail({
                    receiverEmail: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.timeString,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    verifyLink: generateVerifyLink(inputData.doctorId, token),
                });

                // upsert using findOrCreate instead of checking findOne as before
                const user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: "R3",
                        firstName: inputData.fullName,
                        gender: inputData.selectedGender,
                        address: inputData.address,
                    },
                });

                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: "S1", // S1 ~ new
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            token: token,
                        },
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save patient booking successfully!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// escape from all promise
const postBookAppointmentService2 = async (inputData) => {
    try {
        if (!inputData.email) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            await db.User.findOrCreate({
                where: { email: inputData.email },
                defaults: {
                    email: inputData.email,
                    roleId: "R3",
                },
            });
            return {
                errCode: 0,
                errMessage: "OK",
            };
        }
    } catch (err) {
        throw new Error(err);
    }
};

const postVerifyBookingService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update appointment status successfully!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:
                            "Sorry! This appointment was verified or does not exist!",
                    });
                }
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointmentService,
    postBookAppointmentService2,
    postVerifyBookingService,
};
