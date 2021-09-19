require("dotenv").config();
import nodemailer from "nodemailer";

const sendConfirmEmail = async (dataSend) => {
    console.log("check dataSend sendConfirmEmail>>>", dataSend);
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ClinicBooker" <hieu.nhan.hcmus@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "[ClinicBookder] Xác nhận đặt lịch khám bệnh", // Subject line
        text: "Hello ✔", // plain text body
        html: `
        <h2>Cảm ơn bạn đã đặt lịch khám tại ClinicBooker!</h2>
        <p>Xin chào <b>${dataSend.patientName}</b>,</p>
        <p>Yêu cầu đặt khám của bạn đã được tiếp nhận.</p>
        <br/>
        <p>THÔNG TIN CHI TIẾT:</p>
        <p>Người đặt: <b>${dataSend.patientName}</b></p>
        <p>Lý do khám: <b>Nhức đầu</b></p>
        <p>Bác sĩ: <b>${dataSend.doctorName}</b></p>
        <p>Thời gian: <b>${dataSend.time}</b></p>
        <p>Vui lòng kiểm tra lại thông tin và click vào link sau để xác nhận nhé:
        <div><a href=${dataSend.verifyLink} target="_blank">${dataSend.verifyLink}</a></p></div>
        `, // html body
    });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
}

const sendAttachment = async (dataSend) => {
    console.log("check dataSend sendConfirmEmail>>>", dataSend);
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"ClinicBooker" <hieu.nhan.hcmus@gmail.com>',
        to: dataSend.email,
        subject: "[ClinicBooker] Hoàn tất quá trình đặt lịch khám bệnh",
        text: "Hello ✔",
        html: `
        <h2>Cảm ơn bạn đã đặt lịch khám tại ClinicBooker!</h2>
        <p>Xin chào ${dataSend.patientName},</p>
        <p>Quá trình khám bệnh của bạn đã hoàn tất</p>
        <p>Vui lòng kiểm tra file hoá đơn đính kèm</p>
        <p>Chúc bạn thật nhiều sức khoẻ!</p>
        <br/>
        `,
        attachments: [
            {
                filename: `prescription-${dataSend.patientId}-${
                    dataSend.patientName
                }-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: "base64",
            },
        ],
    });
};

module.exports = {
    sendConfirmEmail,
    sendAttachment,
};
