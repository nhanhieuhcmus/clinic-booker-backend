import db from "../models/index";
import emailService from './emailService';
import _, { reject } from "lodash";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password", "image"],
                },
                raw: true,
            });
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const checkValidate = (doctorInfoInput) => {
    const fieldArr = [
        "doctorId",
        "contentHTML",
        "contentMarkdown",
        "selectedPrice",
        "selectedPayment",
        "selectedProvince",
        "nameClinic",
        "addressClinic",
        "specialtyId",
    ];
    return fieldArr.filter((item) => doctorInfoInput[item]);
};

const postInfoDoctorService = (doctorInfoInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            // validate
            console.log("check doctor info input: ", doctorInfoInput);
            if (!checkValidate(doctorInfoInput)) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                // upsert to Markdown
                if (doctorInfoInput.action === "CREATE") {
                    await db.Markdown.create({
                        doctorId: doctorInfoInput.doctorId,
                        contentHTML: doctorInfoInput.contentHTML,
                        contentMarkdown: doctorInfoInput.contentMarkdown,
                        description: doctorInfoInput.description,
                    });
                } else {
                    // EDIT CASE
                    const doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: doctorInfoInput.doctorId },
                        raw: false,
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML =
                            doctorInfoInput.contentHTML;
                        doctorMarkdown.contentMarkdown =
                            doctorInfoInput.contentMarkdown;
                        doctorMarkdown.description =
                            doctorInfoInput.description;

                        await doctorMarkdown.save();
                    }
                }

                // upsert to DoctorInfo
                const doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorInfoInput.doctorId },
                    raw: false,
                });

                if (doctorInfo) {
                    // update
                    doctorInfo.doctorId = doctorInfoInput.doctorId;
                    doctorInfo.priceId = doctorInfoInput.selectedPrice;
                    doctorInfo.paymentId = doctorInfoInput.selectedPayment;
                    doctorInfo.provinceId = doctorInfoInput.selectedProvince;
                    doctorInfo.nameClinic = doctorInfoInput.nameClinic;
                    doctorInfo.addressClinic = doctorInfoInput.addressClinic;
                    doctorInfo.note = doctorInfoInput.note;
                    doctorInfo.specialtyId = doctorInfoInput.specialtyId;
                    doctorInfo.clinicId = doctorInfoInput.clinicId;
                    

                    await doctorInfo.save();
                } else {
                    // create
                    await db.Doctor_Info.create({
                        doctorId: doctorInfoInput.doctorId,
                        priceId: doctorInfoInput.selectedPrice,
                        paymentId: doctorInfoInput.selectedPayment,
                        provinceId: doctorInfoInput.selectedProvince,
                        nameClinic: doctorInfoInput.nameClinic,
                        addressClinic: doctorInfoInput.addressClinic,
                        note: doctorInfoInput.note,
                        specialtyId: doctorInfoInput.specialtyId,
                        clinicId: doctorInfoInput.clinicId,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save info doctor successfully",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const doctor = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "description",
                                "contentMarkdown",
                                "contentHTML",
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],

                    raw: true,
                    nest: true,
                });
                if (doctor && doctor.image) {
                    doctor.image = Buffer.from(doctor.image, "base64").toString(
                        "binary"
                    );
                }
                if (!doctor) {
                    doctor = {};
                }
                resolve({
                    errCode: 0,
                    data: doctor,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("check data from server: ", data);
            if (!data.scheduleArr || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                let schedule = data.scheduleArr;
                if (schedule && schedule.length) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                /**
                 * If a schedule time is already exist,
                 * only create the new one to db
                 */

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                });

                /* Compare to find what is different */
                const toCreate = _.differenceWith(
                    schedule,
                    existing,
                    (a, b) => {
                        return a.timeType === b.timeType && a.date === b.date;
                    }
                );

                console.log("================================");
                console.log("check toCreate: ", toCreate);
                console.log("================================");

                /* Found the new */
                if (toCreate && toCreate.length) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: "Bulk create schedule successfully!",
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.User,
                            as: "doctorData",
                            attributes: ["firstName", "lastName"],
                        },
                    ],
                    nest: true,
                    raw: false,
                });
                if (!schedule) schedule = [];
                console.log("CHECK SCHEDULE: ", schedule);
                resolve({
                    errCode: 0,
                    data: schedule,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const getExtraInfoDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const extraInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "priceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "paymentTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "provinceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!extraInfo) extraInfo = {};
                resolve({
                    errCode: 0,
                    data: extraInfo,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getProfileDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                let profileDoctor = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "description",
                                "contentHTML",
                                "contentMarkdown",
                            ],
                        },

                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],

                    raw: true,
                    nest: true,
                });
                if (profileDoctor && profileDoctor.image) {
                    profileDoctor.image = Buffer.from(
                        profileDoctor.image,
                        "base64"
                    ).toString("binary");
                }
                if (!profileDoctor) {
                    profileDoctor = {};
                }
                resolve({
                    errCode: 0,
                    data: profileDoctor,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const getAllPatientByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required paramter!",
                });
            } else {
                const data = await db.Booking.findAll({
                    where: { statusId: "S2", doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.User,
                            attributes: [
                                "email",
                                "firstName",
                                "lastName",
                                "address",
                                "gender",
                            ],
                            as: "patientTypeData",
                            include: [
                                {
                                    model: db.Allcode,
                                    attributes: ["valueVi", "valueEn"],
                                    as: "genderData",
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            attributes: ["valueVi", "valueEn"],
                            as: "timeTypeDataPatient",
                        },
                    ],

                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const sendPrescriptionService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.patientId ||
                !data.timeType ||
                !data.imgBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                // update patient status (S3)
                const appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: "S2",
                    },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save();
                }

                // send email
                await emailService.sendAttachment(data);


                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHomeService,
    getAllDoctorsService,
    postInfoDoctorService,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDateService,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
    getAllPatientByDateService,
    sendPrescriptionService,
};
