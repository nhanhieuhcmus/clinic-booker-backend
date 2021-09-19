import db from "../models/index";

const createNewClinicService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check inputData from server>> ", inputData);
            if (
                !inputData.name ||
                !inputData.address ||
                !inputData.imageBase64 ||
                !inputData.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                await db.Clinic.create({
                    name: inputData.name,
                    image: inputData.imageBase64,
                    address: inputData.address,
                    descriptionMarkdown: inputData.descriptionMarkdown,
                    descriptionHTML: inputData.descriptionHTML,
                });

                resolve({
                    errCode: 0,
                    errMessage: "Save clinic successfully!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllClinicsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll();
            if (clinics && clinics.length > 0 && clinics) {
                clinics = clinics.map((item) => {
                    item.image = Buffer.from(item.image, "base64").toString(
                        "binary"
                    );
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: clinics,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailClinicByIdService = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const data = await db.Clinic.findOne({
                    where: { id: clinicId },
                    attributes: [
                        "name",
                        "address",
                        "descriptionHTML",
                        "descriptionMarkdown",
                    ],
                });
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: clinicId },
                        attributes: ["doctorId", "provinceId"],
                    });

                    data.doctorClinic = doctorClinic;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const editClinicService = async (inputData) => {
    try {
        if (!inputData.id) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let clinic = await db.Clinic.findOne({
                where: { id: inputData.id },
                raw: false,
            });
            if (clinic) {
                clinic.name = inputData.name && inputData.name;
                clinic.address = inputData.address && inputData.address;
                clinic.image = inputData.imageBase64 && inputData.imageBase64;
                clinic.descriptionHTML =
                    inputData.descriptionHTML && inputData.descriptionHTML;
                clinic.descriptionMarkdown =
                    inputData.descriptionMarkdown &&
                    inputData.descriptionMarkdown;
                await clinic.save();
                return {
                    errCode: 0,
                    errMessage: "Update clinic successfully!",
                };
            }
            return {
                errCode: 2,
                errMessage: "The user is not exist!",
            };
        }
    } catch (error) {
        throw error;
    }
};

const deleteClinicService = async (clinicId) => {
    try {
        if (!clinicId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            const clinic = await db.Clinic.findOne({
                where: { id: clinicId },
                raw: false,
            });
            if (!clinic) {
                return {
                    errCode: 2,
                    errMessage: "The clinic is not exist!",
                };
            } else {
                await clinic.destroy();
                return {
                    errCode: 0,
                    errMessage: "Delete clinic successfully!",
                };
            }
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNewClinicService,
    getAllClinicsService,
    getDetailClinicByIdService,
    editClinicService,
    deleteClinicService,
};
