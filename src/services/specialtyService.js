import db from "../models/index";


const createNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Create specialty successfully!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllSpecialtiesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll();
            if (specialties && specialties.length && specialties) {
                specialties = specialties.map((item) => {
                    item.image = Buffer.from(item.image, "base64").toString(
                        "binary"
                    );
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: specialties,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailSpecialtyByIdService = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                const data = await db.Specialty.findOne({
                    where: { id: specialtyId },
                    attributes: ["name", "descriptionHTML", "descriptionMarkdown"],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === "all") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: specialtyId },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        // find by province
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: specialtyId,
                                provinceId: location,
                            },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }

                    data.doctorSpecialty = doctorSpecialty;
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

const deleteSpecialtyService = async (specialtyId) => {
    try {
        if (!specialtyId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            const specialty = await db.Specialty.findOne({
                where: { id: specialtyId },
                raw: false,
            });
            if (!specialty) {
                return {
                    errCode: 2,
                    errMessage: "The specialty is not exist!",
                };
            } else {
                await specialty.destroy();
                return {
                    errCode: 0,
                    errMessage: "Delete specialty successfully!",
                };
            }
        }
    } catch (error) {
        throw error;
    }
};

const editSpecialtyService = async (inputData) => {
    try {
        if (!inputData.id) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let specialty = await db.Specialty.findOne({
                where: { id: inputData.id },
                raw: false,
            });
            if (specialty) {
                specialty.name = inputData.name && inputData.name;
                specialty.image = inputData.imageBase64 && inputData.imageBase64;
                specialty.descriptionHTML =
                    inputData.descriptionHTML && inputData.descriptionHTML;
                specialty.descriptionMarkdown =
                    inputData.descriptionMarkdown &&
                    inputData.descriptionMarkdown;
                await specialty.save();
                return {
                    errCode: 0,
                    errMessage: "Update specialty successfully!",
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



module.exports = {
    createNewSpecialtyService,
    getAllSpecialtiesService,
    getDetailSpecialtyByIdService,
    editSpecialtyService,
    deleteSpecialtyService,
};
