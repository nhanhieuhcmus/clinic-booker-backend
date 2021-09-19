require("dotenv").config();
import nodemailer from "nodemailer";

const sendConfirmEmail = async (dataSend) => {
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
        from: '"BookingCare" <hieu.nhan.hcmus@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello ✔", // plain text body
        html: `
        <h2>Cảm ơn bạn đã đặt lịch khám tại BookingCare!</h2>
        <p>Xin chào ${dataSend.patientName},</p>
        <p>Yêu cầu của bạn đã được tiếp nhận.</p>
        <p>Thông tin chi tiết:</p>
        <p>Người đặt: ${dataSend.patientName}</p>
        <p>Bác sĩ: ${dataSend.doctorName}</p>
        <p>Thời gian: ${dataSend.time}</p>
        <p>Vui lòng kiểm tra lại thông tin và click vào link sau để xác nhận: <a href=${dataSend.verifyLink} target="_blank">${dataSend.verifyLink}</a></p>
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

const sendAttachment= async(dataSend) => {
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
        from: '"BookingCare" <hieu.nhan.hcmus@gmail.com>',
        to: dataSend.email,
        subject: "Thông tin đặt lịch khám bệnh",
        text: "Hello ✔",
        html: `
        <h2>Cảm ơn bạn đã đặt lịch khám tại BookingCare!</h2>
        <p>Xin chào ${dataSend.patientName},</p>
        <p>Yêu cầu của bạn đã được tiếp nhận.</p>
        <p>Thông tin chi tiết:</p>
        <p>Người đặt: abc</p>
        <p>Bác sĩ: abc</p>
        <p>Thời gian: abc</p>
        <p>Vui lòng kiểm tra lại thông tin và click vào link sau để xác nhận: <a href=${dataSend.verifyLink} target="_blank">${dataSend.verifyLink}</a></p>
        `,
        attachments: [
            {
                filename:`prescription-${dataSend.patientId}-${dataSend.patientName}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}


module.exports = {
    sendConfirmEmail,
    sendAttachment,
};
