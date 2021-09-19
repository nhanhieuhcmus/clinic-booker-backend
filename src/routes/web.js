import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";


let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.displayEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/allcode", userController.getAllCode);

    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
    router.get("/api/all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-info-doctor", doctorController.postInfoDoctor);
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
    
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate);
    router.get("/api/get-extra-info-doctor-by-id", doctorController.getExtraInfoDoctorById);
    router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById);
    router.get("/api/get-all-patient-by-date", doctorController.getAllPatientByDate);
    router.post("/api/send-prescription", doctorController.sendPrescription);


    router.post("/api/book-appointment", patientController.postBookAppointment);
    router.post("/api/verify-booking", patientController.postVerifyBooking);

    router.post("/api/create-new-specialty", specialtyController.createNewSpecialty);
    router.get("/api/get-all-specialties", specialtyController.getAllSpecialties);
    router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);
    router.put("/api/edit-specialty", specialtyController.editSpecialty);
    router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);


    router.post("/api/create-new-clinic", clinicController.createNewClinic);
    router.get("/api/get-all-clinics", clinicController.getAllClinics);
    router.get("/api/get-detail-clinic-by-id", clinicController.getDetailClinicById);
    router.put("/api/edit-clinic", clinicController.editClinic);
    router.delete("/api/delete-clinic", clinicController.deleteClinic);



    return app.use("/", router);
};

module.exports = initWebRoutes;
